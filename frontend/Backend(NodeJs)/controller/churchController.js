import Church from '../model/churchModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'churchProfile'); // Changed to churchProfile
const BASE_URL = '/churchProfile/'; // Changed base URL for image access

export const addChurch = async (req, res) => {
  try {
    const { name, address, contact_no, senior_pastor_name, senior_pastor_phone_number, city, state, country, api_key } = req.body;

    // Check if the church already exists
    const existingChurch = await Church.findOne({ name });
    if (existingChurch) {
      return res.status(400).json({ error: 'Church already exists' });
    }

    const newChurch = new Church({
      name,
      address,
      contact_no,
      senior_pastor_name,
      senior_pastor_phone_number,
      city, 
      state,
      country,
      api_key
    });

    // Save the church to the database
    await newChurch.save();

    const userWithoutPassword = {
      _id: newChurch._id,
      name: newChurch.name,
      email: newChurch.email,
      address: newChurch.address,
      country: newChurch.country,
      contact_no: newChurch.contact_no,
      senior_pastor_name: newChurch.senior_pastor_name,
      senior_pastor_phone_number: newChurch.senior_pastor_phone_number,
      city: newChurch.city,
      state: newChurch.state,
      api_key: newChurch.api_key
  
      
  };
    res.status(201).json({ message: 'Church registered successfully', church: userWithoutPassword });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Helper function to construct full image URL
const getFullImageUrl = (baseUrl, imagePath) => {
  try {
      if (!imagePath) return null;
      
      // Remove any leading double slashes
      const cleanImagePath = imagePath.replace(/^\/+/, '');
      const fullUrl = `${baseUrl}/${cleanImagePath}`;
      
      // Validate URL format
      new URL(fullUrl);
      return fullUrl;
  } catch (error) {
      console.error("Error constructing image URL:", error);
      return null;
  }
};

export const fetchAllChurch = async (req, res) => {
  try {
      const churches = await Church.find();
      const baseUrl = req.protocol + '://' + req.get('host');

      const churchesWithFullImageUrls = churches.map(church => {
          const churchObj = church.toObject();
          
          // Use helper function to construct image URL
          const fullImageUrl = getFullImageUrl(baseUrl, churchObj.image);

          return {
              ...churchObj,
              image: fullImageUrl,
              // imageUrl: fullImageUrl // Optional: provide URL in both fields
          };
      });

      // Log the first church for verification
      if (churchesWithFullImageUrls.length > 0) {
          console.log("Sample church with image URL:", {
              name: churchesWithFullImageUrls[0].name,
              imageUrl: churchesWithFullImageUrls[0].image
          });
      }

      res.status(200).json(churchesWithFullImageUrls);
  } catch (error) {
      console.error("Error fetching churches:", error);
      res.status(400).json({ 
          error: error.message,
          details: "Failed to fetch churches with images"
      });
  }
};

export const detailChurch = async (req, res) => {
  try {
      const { id } = req.params;
      const church = await Church.findById(id);

      if (!church) {
          return res.status(404).json({ error: 'Church not found' });
      }

      const baseUrl = req.protocol + '://' + req.get('host');
      const churchData = church.toObject();
      
      // Use helper function to construct image URL
      const fullImageUrl = getFullImageUrl(baseUrl, churchData.image);
      churchData.image = fullImageUrl;
      churchData.imageUrl = fullImageUrl; // Optional: provide URL in both fields

      console.log("Church detail with image URL:", {
          name: churchData.name,
          imageUrl: churchData.image
      });

      res.status(200).json(churchData);
  } catch (error) {
      console.error("Error fetching church details:", error);
      res.status(400).json({ 
          error: error.message,
          details: "Failed to fetch church details"
      });
  }
};


// export const fetchAllChurch = async (req, res) => {
//     try {
//       const churches = await Church.find(); // Fetch all churches
//       res.status(200).json(churches);
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   };


//   export const detailChurch = async (req, res) => {
//     try {
//       const { id } = req.params;
//       const church = await Church.findById(id); // Fetch church by ID
//       // console.log(church)
//       if (!church) {
//         return res.status(404).json({ error: 'Church not found' });
//       }
  
//       res.status(200).json(church);
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   };
  // Add this function to your church controller
export const countAllChurches = async (req, res) => {
  try {
    const count = await Church.countDocuments(); // Count all churches
    res.status(200).json({ total: count }); // Return the total count in the response
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors
  }
};


  export const fetchUserType= async (req, res) => {
    try {
        const userType = req.params.type; 
        const users = await User.find({ type: userType }); 
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  };
  

  
 

  
// Handle Base64 Image Function for Church
const handleChurchBase64Image = async (imageBase64, churchId) => {
  try {
      if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
      }

      const matches = imageBase64.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
          console.error("Invalid base64 string format.");
          return { error: true, message: "Invalid base64 string" };
      }

      const imageType = matches[1];
      const base64Data = matches[2];
      const imageFileName = `church_${churchId}_${Date.now()}.${imageType}`;
      const imagePath = path.join(uploadDir, imageFileName);

      try {
          fs.writeFileSync(imagePath, base64Data, "base64");
          const newImagePath = `${BASE_URL}${imageFileName}`;
          console.log("New image path for database:", newImagePath);
          return { imagePath: newImagePath };
      } catch (error) {
          console.error("Error writing the church image file:", error);
          return { error: true, message: "Failed to save church image." };
      }
  } catch (error) {
      console.error("Error in handleChurchBase64Image:", error);
      return { error: true, message: "Failed to process church image." };
  }
};

// Updated updateChurch controller
export const updateChurch = async (req, res) => {
  try {
      const { id } = req.params;
      const updateFields = { ...req.body };
      
      console.log("Original Request Body:", req.body);

      // Handle image if provided
      if (updateFields.image) {
          const imageResult = await handleChurchBase64Image(updateFields.image, id);
          if (imageResult.error) {
              return res.status(400).json({ message: imageResult.message });
          }
          
          // Store the image path in updateFields
          updateFields.image = imageResult.imagePath;
          console.log("Image path to be saved:", updateFields.image);
      }

      // Update church in database with explicit image field
      const updatedChurch = await Church.findByIdAndUpdate(
          id,
          {
              $set: {
                  name: updateFields.name,
                  address: updateFields.address,
                  contact_no: updateFields.contact_no,
                  city: updateFields.city,
                  state: updateFields.state,
                  country: updateFields.country,
                  senior_pastor_name: updateFields.senior_pastor_name,
                  senior_pastor_phone_number: updateFields.senior_pastor_phone_number,
                  api_key: updateFields.api_key,
                  image: updateFields.image // Explicitly set the image field
              }
          },
          { new: true, runValidators: true }
      );

      if (!updatedChurch) {
          return res.status(404).json({ message: 'Church not found' });
      }

      // Log the updated church object
      console.log("Updated Church in DB:", updatedChurch);

      // Construct full image URL for response
      const fullUrl = req.protocol + '://' + req.get('host');
      const imageFullPath = updatedChurch.image ? `${fullUrl}${updatedChurch.image}` : null;

      // Send response with updated church data
      res.status(200).json({ 
          message: 'Church updated successfully', 
          church: {
              ...updatedChurch.toObject(),
              image: imageFullPath
          }
      });

  } catch (error) {
      console.error("Update Church Error:", error);
      res.status(400).json({ error: error.message });
  }
};


  // Delete Church by ID
export const deleteChurch = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedChurch = await Church.findByIdAndDelete(id);

    if (!deletedChurch) {
      return res.status(404).json({ error: 'Church not found' });
    }

    res.status(200).json({ message: 'Church deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

  
