import User from '../model/authModel.js';
import Church from '../model/churchModel.js';
import bcrypt from 'bcryptjs'; 
// console.log(bcrypt)
// console.log("Using bcrypt:", bcrypt);
// const salt = bcrypt.genSaltSync(10);
// console.log("Salt generated:", salt);

export const addUser = async (req, res) => {
  console.log('Request Body:', req.body);

  try {
    const { firstName, lastName, email, password, address, country, suburb,termAgreement, attendedBefore, broughtBy, faithLevel,  phone, type, churchId, pincode, state, status, created_at, updated_at } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Initialize the user object with provided data
    const newUserData = { 
      firstName,
      lastName,
      email, 
      type,
      address, 
      country, 
      phone, 
      suburb,
      termAgreement,
      attendedBefore,
      broughtBy,
      faithLevel,
      pincode, 
      churchId, 
      state, 
      status, 
      created_at, 
      updated_at 
    };

    // Hash the password if provided
    // if (password) {
    //   // newUserData.password = await bcrypt.hash(password, 10);
    //   newUserData.password = await bcrypt.hashSync(password, salt);
    // }
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      newUserData.password = bcrypt.hashSync(password, salt);  // Remove `await` here
      console.log("salt",salt)
    }
    

    const newUser = new User(newUserData);
console.log("newUser",newUser)
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
      suburb: savedUser.suburb,
      pincode: savedUser.pincode,
      churchId: savedUser.churchId,
      state: savedUser.state,
      status: savedUser.status,
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


// Add this function to your user controller
export const countUserByType = async (req, res) => {
  try {
    const userType = req.params.type; // Get the user type from the URL parameter
    const churchId = req.query.churchId; // Get churchId from query parameters if provided

    console.log(`Counting users of type: ${userType}`); // Debugging log
    console.log(`Church ID: ${churchId}`); // Debugging log for churchId

    // Build the query object
    let query = { type: userType };
    
    // If churchId is provided, add it to the query
    if (churchId) {
      query.churchId = churchId;
    }

    // Count the number of users with the specified type (and churchId if provided)
    const totalCount = await User.countDocuments(query);
    
    // Send the count in the response
    res.status(200).json({ message: 'Count retrieved successfully', totalCount });
  } catch (error) {
    console.error("Error fetching user count:", error); // Log error for debugging
    res.status(500).json({ message: error.message });
  }
};





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
  catch (error) 
  {
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
    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
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
  