import User from '../model/authModel.js';
import Church from '../model/churchModel.js';
import bcrypt from 'bcryptjs';
import DeleteRequest from '../model/deleteRequest.js';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

export const addUser = async (req, res) => {
  console.log('Request Body:', req.body);

  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      image,

      jobTitle,
      department,
      employmentType,
      startDate,
      endDate,
      workLocation,
      workEmail,

      userRole,
      systemAccessLevel,
      assignedTeams,

      educationLevel,
      certifications,
      skills,
      languagesSpoken,

      employeeId,
      salaryOrHourlyRate,
      payrollBankDetails,
      tfnAbn,
      workVisaStatus,

      emergencyContact,
      linkedinProfile,
      notesAndComments,

      address,
      country,
      state,
      city,
      suburb,
      pincode,

      type,
      status,
      termAgreement,
      attendedBefore,
      broughtBy,
      faithLevel,

      churchId,
      created_at,
      updated_at
    } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const formatEmail = (email) => {
      if (!email) return '';
      return email.charAt(0).toLowerCase() + email.slice(1);
    };

    // Initialize the user object with provided data
    const newUserData = {
      firstName,
      lastName,
      email: formatEmail(email), 
      type,
      address,
      country,
      phone,
      dateOfBirth,
      gender,
      image,
      suburb,
      termAgreement,
      attendedBefore,
      broughtBy,
      faithLevel,
      pincode,
      churchId,
      state,
      city,
      status,
      jobTitle,
      department,
      employmentType,
      startDate,
      endDate,
      workLocation,
      workEmail,
      userRole,
      systemAccessLevel,
      assignedTeams,
      educationLevel,
      certifications,
      skills,
      languagesSpoken,
      employeeId,
      salaryOrHourlyRate,
      payrollBankDetails,
      tfnAbn,
      workVisaStatus,
      emergencyContact,
      linkedinProfile,
      notesAndComments,
      created_at,
      updated_at
    };

    // Hash the password if provided
    if (password) {
      newUserData.password = await bcrypt.hash(password, 10);
    }

    const newUser = new User(newUserData);
    console.log("newUser", newUser);

    // Save the user to the database
    const savedUser = await newUser.save();

    // Create a user object without the password
    const userWithoutPassword = {
      _id: savedUser._id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      address: savedUser.address,
      country: savedUser.country,
      phone: savedUser.phone,
      dateOfBirth: savedUser.dateOfBirth,
      gender: savedUser.gender,
      image: savedUser.image,
      suburb: savedUser.suburb,
      pincode: savedUser.pincode,
      churchId: savedUser.churchId,
      state: savedUser.state,
      city: savedUser.city,
      status: savedUser.status,
      jobTitle: savedUser.jobTitle,
      department: savedUser.department,
      employmentType: savedUser.employmentType,
      startDate: savedUser.startDate,
      endDate: savedUser.endDate,
      workLocation: savedUser.workLocation,
      workEmail: savedUser.workEmail,
      userRole: savedUser.userRole,
      systemAccessLevel: savedUser.systemAccessLevel,
      assignedTeams: savedUser.assignedTeams,
      educationLevel: savedUser.educationLevel,
      certifications: savedUser.certifications,
      skills: savedUser.skills,
      languagesSpoken: savedUser.languagesSpoken,
      employeeId: savedUser.employeeId,
      salaryOrHourlyRate: savedUser.salaryOrHourlyRate,
      payrollBankDetails: savedUser.payrollBankDetails,
      tfnAbn: savedUser.tfnAbn,
      workVisaStatus: savedUser.workVisaStatus,
      emergencyContact: savedUser.emergencyContact,
      linkedinProfile: savedUser.linkedinProfile,
      notesAndComments: savedUser.notesAndComments,
      created_at: savedUser.created_at,
      updated_at: savedUser.updated_at
    };

    // Send the user details in the response
    res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword });
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const countUserByType = async (req, res) => {
  try {
    const userType = req.params.type; // Get the user type from the URL parameter
    const churchId = req.query.churchId; // Get churchId from query parameters if provided

    console.log(`Counting users of type: ${userType}`);
    console.log(`Church ID: ${churchId}`);

    // Find all valid church IDs from the Church collection
    const validChurches = await Church.find({}, '_id');
    const validChurchIds = validChurches.map(church => church._id.toString());

    // Build the query object
    let query = {
      type: userType,
      churchId: { $in: validChurchIds } // Ensure churchId exists in valid churches
    };

    // If a specific churchId is provided, filter further
    if (churchId) {
      if (!validChurchIds.includes(churchId)) {
        return res.status(404).json({ message: 'Invalid church ID' });
      }
      query.churchId = churchId;
    }

    // Count the number of users with the specified type and valid churchId
    const totalCount = await User.countDocuments(query);

    res.status(200).json({ message: 'Count retrieved successfully', totalCount });
  } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).json({ message: error.message });
  }
};
// Add this function to your user controller
// export const countUserByType = async (req, res) => {
//   try {
//     const userType = req.params.type; // Get the user type from the URL parameter
//     const churchId = req.query.churchId; // Get churchId from query parameters if provided

//     console.log(`Counting users of type: ${userType}`); // Debugging log
//     console.log(`Church ID: ${churchId}`); // Debugging log for churchId

//     // Build the query object
//     let query = { type: userType };

//     // If churchId is provided, add it to the query
//     if (churchId) {
//       query.churchId = churchId;
//     }

//     // Count the number of users with the specified type (and churchId if provided)
//     const totalCount = await User.countDocuments(query);

//     // Send the count in the response
//     res.status(200).json({ message: 'Count retrieved successfully', totalCount });
//   } catch (error) {
//     console.error("Error fetching user count:", error); // Log error for debugging
//     res.status(500).json({ message: error.message });
//   }
// };





// In your user controller (e.g., userController.js)
export const fetchAllUser = async (req, res) => {
  try {
    // Fetch all users and populate the 'churchId' field with corresponding church names
    const users = await User.find()
      .select('-password') // Exclude the password field
      .populate('churchId', 'name'); // Populate churchId with the church name

    // Return the users in the response
    res.json(users);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const fetchUserType = async (req, res) => {
  try {
    const userType = req.params.type;
    const { churchId } = req.query;

    // Build a query object based on the presence of churchId
    let query = { type: userType };
    if (churchId) {
      query.churchId = churchId;
    }
    // Find users matching the query
    const users = await User.find(query);
    console.log('Users before populate:', users); // Log users before populating
    // Find users matching the query and populate the churchId field
    // const users = await User.find(query).populate('churchId');
    const populatedUsers = await User.find(query).populate('churchId', '_id');
    console.log('Users after populate:', populatedUsers); // Log populated users
    // Map through users to format the response
    const formattedUsers = users.map(user => ({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,

      email: user.email,
      phone: user.phone,
      churchId: user.churchId ? user.churchId._id : null,
      address: user.address,
      country: user.country,
      state: user.state,
      suburb: user.suburb,
      pincode: user.pincode,
      status: user.status,
      created_at: user.created_at,
      updated_at: user.updated_at
    }));

    // Send the formatted user data as the response
    res.json(formattedUsers);
  }
  catch (error) {
    // Handle errors and send an error response
    res.status(500).json({ message: error.message });
  }
};


// export const fetchUserType = async (req, res) => {
//   try {
//       // Get the user type from request parameters
//       const userType = req.params.type; 

//       // Find users of the specified type and populate the churchId field with only the _id
//       const users = await User.find({ type: userType }).populate('churchId', '_id'); 

//       // Map through users to format the response
//       const formattedUsers = users.map(user => ({
//           _id: user._id,
//           name: user.name,
//           email: user.email,
//           phone: user.phone,
//           churchId: user.churchId ? user.churchId._id : null, // Check if churchId is defined
//           address: user.address,
//           country: user.country,
//           state: user.state,
//           city: user.city,
//           pincode: user.pincode,
//           status: user.status,
//           created_at: user.created_at,
//           updated_at: user.updated_at
//       }));

//       // Send the formatted user data as the response
//       res.json(formattedUsers);
//   } catch (error) {
//       // Handle errors and send an error response
//       res.status(500).json({ message: error.message });
//   }
// };





export const detailUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch user by ID and exclude the 'password' field
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get the full URL for the server
    const fullUrl = `${req.protocol}://${req.get("host")}`;

    // If the user has an image, append the full path
    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      address: user.address,
      country: user.country,
      phone: user.phone,
      pincode: user.pincode,
      state: user.state,
      city: user.city,
      type: user.type,
      status: user.status,
      image: user.image ? `${fullUrl}${user.image}` : null, // Full URL for image
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(400).json({ error: error.message });
  }
};



export const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    // If the password is being updated, hash it
    if (updateFields.password) {
      updateFields.password = await bcrypt.hash(updateFields.password, 10);
    }

    // Update only the fields provided in the request
    const updatedUser = await User.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove password from the updated user object before sending it in the response
    const { password, ...userWithoutPassword } = updatedUser.toObject();

    res.status(200).json({ message: 'User updated successfully', user: userWithoutPassword });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const requestDeleteUser = async (req, res) => {
  try {
    const { userId, reason } = req.body;

    // Validate input
    if (!userId || !reason) {
      return res.status(400).json({ error: 'User ID and reason are required' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if a deletion request already exists for this user
    const existingRequest = await DeleteRequest.findOne({ userId, status: 'pending' });
    if (existingRequest) {
      return res.status(400).json({ error: 'A deletion request is already pending for this account' });
    }

    // Create a new deletion request
    const deleteRequest = new DeleteRequest({
      userId,
      reason,
    });

    await deleteRequest.save();

    res.status(201).json({ message: 'Deletion request submitted successfully' });
  } catch (error) {
    console.error('Error in requestDeleteUser:', error);
    res.status(500).json({ error: error.message || 'Server error while submitting deletion request' });
  }
};

export const getDeleteRequests = async (req, res) => {
  try {
    const requests = await DeleteRequest.find().populate('userId', 'email firstName lastName'); // Optional: populate user details
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching delete requests:', error);
    res.status(500).json({ error: error.message || 'Server error while fetching deletion requests' });
  }
};

export const updateDeleteRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    // Check if status is valid
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Use "approved" or "rejected"' });
    }

    // Find the delete request
    const request = await DeleteRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Deletion request not found' });
    }

    // Update the status of the request
    request.status = status;
    await request.save();

    // If the request is approved, delete the associated user
    if (status === 'approved' && request.userId) {
      const deletedUser = await User.findByIdAndDelete(request.userId);
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found while deleting after approval' });
      }
      return res.status(200).json({
        message: 'Request approved and user deleted successfully',
      });
    }

    // If rejected, just return success message
    res.status(200).json({ message: `Request ${status} successfully` });
  } catch (error) {
    console.error('Error updating delete request:', error);
    res.status(500).json({
      error: error.message || 'Server error while updating deletion request',
    });
  }
};



export const getDeleteRequestStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const request = await DeleteRequest.findOne({ userId }).sort({ requestedAt: -1 }); // Get latest request
    if (!request) {
      return res.status(200).json({ status: null }); // No request found
    }
    res.status(200).json({ status: request.status });
  } catch (error) {
    console.error('Error fetching delete request status:', error);
    res.status(500).json({ error: error.message || 'Server error while fetching request status' });
  }
};




export const requestResetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    
    const user = await User.findOne({ email });

    if (user) {
      // Generate a random 4-digit code
      const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
      
      
      user.resetCode = resetCode;
      user.resetCodeExpires = Date.now() + 3600000; 
      await user.save();

      
      await sendResetEmail(email, resetCode);

      
      return res.status(200).json({ 
        message: 'A 4-digit reset code has been sent to your email.',
      
        code: resetCode 
      });
    }

   
    res.status(200).json({ message: 'No account found with this email.' });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

const sendResetEmail = async (email, resetCode) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Password Reset Code',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background-color: #231f20;
            color: #ffffff;
            padding: 20px;
            text-align: center;
          }
          .header h2 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 30px;
            text-align: center;
          }
          .code-box {
            background-color: #f8f8f8;
            border: 2px dashed #231f20;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
            display: inline-block;
          }
          .code {
            font-size: 32px;
            font-weight: bold;
            color: #231f20;
            letter-spacing: 5px;
          }
          .instructions {
            font-size: 16px;
            line-height: 1.6;
            color: #666;
          }
          .footer {
            background-color: #f4f4f4;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #888;
          }
          .button {
            display: inline-block;
            padding: 12px 25px;
            background-color: #231f20;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin-top: 20px;
          }
          .button:hover {
            background-color: #3a3335;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Password Reset Request</h2>
          </div>
          <div class="content">
            <p class="instructions">
              You have requested to reset your password. Please use the 4-digit code below to proceed:
            </p>
            <div class="code-box">
              <span class="code">${resetCode}</span>
            </div>
            <p class="instructions">
              This code is valid for <strong>1 hour</strong>. Enter it in the reset password form to set a new password.
            </p>
            <p class="instructions">
              If you didn’t request this, you can safely ignore this email.
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Church Translator. All rights reserved.</p>
            <p>Need help? Contact us at <a href="mailto:adasilva@simpleit4u.com.au">adasilva@simpleit4u.com.au</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};


export const verifyResetCodeAndChangePassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    // Find user with matching email and valid reset code
    const user = await User.findOne({ 
      email,
      resetCode: code,
      resetCodeExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid or expired reset code.' 
      });
    }

    // Check if new password matches the current password
    const isMatch = await bcrypt.compare(newPassword, user.password);
    if (isMatch) {
      return res.status(400).json({ 
        message: 'New password cannot be the same as your current password. Please choose a different password.' 
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Clear reset code fields
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;

    // Save the updated user
    await user.save();

    res.status(200).json({ 
      message: 'Password updated successfully. You can now log in.' 
    });
  } catch (error) {
    console.error('Error verifying code and changing password:', error);
    res.status(500).json({ 
      message: 'Server error. Please try again later.' 
    });
  }
};