import User from '../model/authModel.js';

import bcrypt from 'bcrypt';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      // Return the "Invalid Credentials" message if user not found or password does not match
      return res.status(401).json({ error: 'Invalid Credentials' });
    }

    // Construct the full URL for the image if it exists
    const fullUrl = req.protocol + '://' + req.get('host'); // Get full URL (http://localhost:5500)
    const imagePath = user.image ? `${fullUrl}${user.image}` : null; // Construct image path

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        type: user.type,
        phone: user.phone,
        address: user.address,
        country: user.country,
        suburb: user.suburb,
        pincode: user.pincode,
        state: user.state,
        status: user.status,
        churchId: user.churchId,
        image: imagePath 
      }
    });
  } catch (error) {
    // Send a generic error message
    res.status(400).json({ error: 'Invalid Credentials' });
  }
};

