import User from '../model/authModel.js';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Configure multer with appropriate file size limit and error handling
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

// Export multer middleware with proper configuration
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB in bytes
        fieldSize: 5 * 1024 * 1024 // 5MB field size limit 
    },
    fileFilter: fileFilter
});

// View Profile
export const viewProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user details excluding the password
        res.status(200).json({
            user: {
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
                image: user.image // Return the full URL directly from the database
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Handle Base64 Image Function
const handleBase64Image = async (imageurl, userId, req) => {
    const matches = imageurl.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        console.error("Invalid base64 string format.");
        return { error: true, message: "Invalid base64 string" };
    }

    const imageType = matches[1]; // e.g., 'png', 'jpg'
    const imageBase64 = matches[2];
    const imageFileName = `${userId}_${Date.now()}.${imageType}`; // Generate file name
    const imagePath = path.join(uploadDir, imageFileName); // Absolute path to save the image

    try {
        console.log("Saving image to:", imagePath);
        fs.writeFileSync(imagePath, imageBase64, "base64");
        console.log("Image successfully written:", imageFileName);
    } catch (error) {
        console.error("Error writing the file:", error);
        return { error: true, message: "Failed to save image." };
    }

    // Only store the relative path in the database
    const relativePath = `/uploads/${imageFileName}`; // ✅ Correct path for DB

    // Create the full URL for frontend response
    const fullUrl = `${req.protocol}://${req.get('host')}${relativePath}`;
    console.log("Full URL for frontend:", fullUrl);

    return {
        imagePath: relativePath, // ✅ Relative path for DB
        fullUrl: fullUrl // ✅ Full URL for response
    };
};


// Updated updateProfile method to check for image input
// Update user with the new image path
export const updateProfile = async (req, res) => {
    try {
        console.log("📥 Request Body:", req.body);

        const userId = req.params.id;
        const {
            firstName, lastName, email, address, country, phone,
            pincode, state, city, type, status, image
        } = req.body;

        let newImagePath = null; // ✅ To store the new image path

        // Handle base64 image if provided
        if (image && image.startsWith('data:image')) {
            const result = await handleBase64Image(image, userId, req);

            if (result.error) {
                return res.status(400).json({ message: result.message });
            }

            // ✅ Save only the relative path in the DB
            newImagePath = result.imagePath;
            console.log("🖼️ New Image Path (Stored in DB):", newImagePath);
        } else {
            console.log("ℹ️ No new image provided in the request body.");
        }

        // ✅ Update user with new image path if available
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                firstName, lastName, email, address, country, phone,
                pincode, state, city, type, status,
                ...(newImagePath && { image: newImagePath }) // ✅ Save only if new image exists
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            console.error("❌ User not found during update.");
            return res.status(404).json({ message: 'User not found' });
        }

        // ✅ Generate full URL for the updated image
        const fullImageUrl = updatedUser.image
            ? `${req.protocol}://${req.get('host')}${updatedUser.image}`
            : null;

        res.status(200).json({
            message: '✅ Profile updated successfully',
            user: {
                id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                address: updatedUser.address,
                country: updatedUser.country,
                phone: updatedUser.phone,
                pincode: updatedUser.pincode,
                state: updatedUser.state,
                city: updatedUser.city,
                type: updatedUser.type,
                status: updatedUser.status,
                image: fullImageUrl // ✅ Full URL sent to the frontend
            }
        });
    } catch (error) {
        console.error("❌ Update Profile Error:", error);
        res.status(500).json({ error: error.message });
    }
};

export const Profile = async (req, res) => {
    try {
        const userId = req.params.id;
        const { firstName, lastName, email, address, country, phone, pincode, state, city, type, status } = req.body;

        // Handle the image upload (store only relative path in DB)
        let imagePath;
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`; // Only save relative path in DB
        }

        // Update the user profile, including the image path if provided
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                email,
                address,
                country,
                phone,
                pincode,
                state,
                city,
                type,
                status,
                ...(imagePath && { image: imagePath }) // Only update the image if provided
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get the full URL for the server
        const fullUrl = `${req.protocol}://${req.get("host")}`;

        // If the user is updated, fetch the updated user data with full image URL
        const userWithFullUrl = {
            id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            address: updatedUser.address,
            country: updatedUser.country,
            phone: updatedUser.phone,
            pincode: updatedUser.pincode,
            state: updatedUser.state,
            city: updatedUser.city,
            type: updatedUser.type,
            status: updatedUser.status,
            image: updatedUser.image
                ? `${fullUrl}${updatedUser.image}`
                : null, // Return full URL if image exists
        };

        // Send back user data with full image path
        res.status(200).json({
            message: "Profile updated successfully",
            user: userWithFullUrl,
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(400).json({ error: error.message });
    }
};



// Change Password
export const changePassword = async (req, res) => {
    try {
        const userId = req.params.id;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);

        if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
            return res.status(401).json({ message: 'Invalid current password' });
        }

        // Hash the new password and save it
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Route handler for uploading profile image (for updating profile)
export const uploadProfileImage = upload.single('image'); // Middleware to handle single image upload

// import User from '../model/authModel.js';
// import bcrypt from 'bcrypt';
// import multer from 'multer';
// import path from 'path';

// // Set up storage for uploaded images
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Save files in the 'uploads' folder
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + path.extname(file.originalname)); // Append unique name to the file
//     }
// });

// // Initialize multer with the storage settings
// const upload = multer({ storage: storage });

// // View Profile
// export const viewProfile = async (req, res) => {
//     try {
//         const userId = req.params.id;
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         // Return user details excluding the password
//         res.status(200).json({ user: {
//             id: user._id,
//             name: user.name,
//             email: user.email,
//             address: user.address,
//             country: user.country,
//             phone: user.phone,
//             pincode: user.pincode,
//             state: user.state,
//             city: user.city,
//             type: user.type,
//             status: user.status,
//             image: user.image // Return the user's image
//         }});
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Update Profile (with image upload)
// export const updateProfile = async (req, res) => {
//     try {
//         const userId = req.params.id;
//         const { firstName, lastName, email, address, country, phone, pincode, state, suburb, type, status,image } = req.body;

//         // Handle the image upload
//         console.log(image)
//         let imagePath;
//         if (image) {
//             const fullUrl = req.protocol + '://' + req.get('host'); // Get full URL (http://localhost:5500)
//             imagePath = `${fullUrl}/uploads/${req.file.filename}`; // Save full path in the database
//         }

//         // Update the user profile, including the image path if provided
//         const updatedUser = await User.findByIdAndUpdate(
//             userId,
//             {
//                 firstName,
//                 lastName,
//                 email,
//                 address,
//                 country,
//                 phone,
//                 pincode,
//                 state,
//                 suburb,
//                 type,
//                 status,
//                 ...(imagePath && { image: imagePath }) // Only update the image if provided
//             },
//             { new: true, runValidators: true }
//         );

//         if (!updatedUser) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Send back all user fields in the response
//         res.status(200).json({
//             message: 'Profile updated successfully',
//             user: {
//                 id: updatedUser._id,
//                 firstName: updatedUser.firstName,
//                 lastName: updatedUser.lastName,

//                 email: updatedUser.email,
//                 address: updatedUser.address,
//                 country: updatedUser.country,
//                 phone: updatedUser.phone,
//                 pincode: updatedUser.pincode,
//                 state: updatedUser.state,
//                 suburb: updatedUser.suburb,
//                 type: updatedUser.type,
//                 status: updatedUser.status,
//                 image: updatedUser.image // Include the image path in the response
//             }
//         });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };


// // Change Password
// export const changePassword = async (req, res) => {
//     try {
//         const userId = req.params.id;
//         const { currentPassword, newPassword } = req.body;

//         const user = await User.findById(userId);

//         if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
//             return res.status(401).json({ message: 'Invalid current password' });
//         }

//         // Hash the new password and save it
//         const hashedPassword = await bcrypt.hash(newPassword, 10);
//         user.password = hashedPassword;
//         await user.save();

//         res.status(200).json({ message: 'Password updated successfully' });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// // Route handler for uploading profile image (for updating profile)
// export const uploadProfileImage = upload.single('image'); // Middleware to handle single image upload
