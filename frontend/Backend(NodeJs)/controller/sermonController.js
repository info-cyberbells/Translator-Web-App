import Sermon from '../model/sermonModel.js';
import User from '../model/authModel.js';
import moment from 'moment-timezone';

// Add Sermon
export const addSermon = async (req, res) => {
  try {
    const { churchId, adminStaffUserId, startDateTime, sermonName, status } = req.body;

    
    const startACST = startDateTime
      ? moment.utc(startDateTime).tz('Australia/Adelaide').toDate()
      : moment.utc().tz('Australia/Adelaide').toDate();

    const newSermon = new Sermon({
      churchId,
      adminStaffUserId,
      sermonName,
      startDateTime: startACST,
      status
    });

    await newSermon.save();
    res.status(201).json({ message: "Sermon added successfully", sermon: newSermon });
  } catch (error) {
    res.status(500).json({ error: "Failed to add sermon", details: error.message });
  }
};


export const updateSermon = async (req, res) => {
  try {
    const { churchId, adminStaffUserId, sermonName, endDateTime, status } = req.body;

  
    const endACST = endDateTime
      ? moment.utc(endDateTime).tz('Australia/Adelaide').toDate()
      : undefined;

    const updateData = {
      churchId,
      adminStaffUserId,
      sermonName,
      status,
      ...(endACST && { endDateTime: endACST }) 
    };

    const updatedSermon = await Sermon.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedSermon) {
      return res.status(404).json({ message: "Sermon not found" });
    }
    res.status(200).json({ message: "Sermon updated successfully", sermon: updatedSermon });
  } catch (error) {
    res.status(500).json({ error: "Failed to update sermon", details: error.message });
  }
};


// Get All Sermons
export const getSermons = async (req, res) => {
  try {
    const sermons = await Sermon.find().populate('churchId', 'adminStaffUserId');
    console.log("SERMONS", sermons)
    res.status(200).json(sermons);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sermons", details: error.message });
  }
};


export const getSermonById = async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id).populate("churchId adminStaffId");
    if (!sermon) {
      return res.status(404).json({ message: "Sermon not found" });
    }
    res.status(200).json(sermon);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sermon", details: error.message });
  }
};



// Delete Sermon
export const deleteSermon = async (req, res) => {
  try {
    const deletedSermon = await Sermon.findByIdAndDelete(req.params.id);
    if (!deletedSermon) {
      return res.status(404).json({ message: "Sermon not found" });
    }
    res.status(200).json({ message: "Sermon deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete sermon", details: error.message });
  }
};


// API to Check for Live Sermons
export const checkLiveSermons = async (req, res) => {
  try {
    // Find all sermons with status "Live"
    const liveSermons = await Sermon.find({ status: "Live" });

    // Update the status of live sermons to "Ended"
    await Promise.all(
      liveSermons.map(async (sermon) => {
        sermon.status = "End";
        await sermon.save();
      })
    );

    // Return whether there are any live sermons
    res.status(200).json({
      hasLiveSermon: liveSermons.length > 0,
      count: liveSermons.length,
      // Only return basic info about the live sermon(s)
      liveSermons: liveSermons.map((sermon) => ({
        id: sermon._id,
        churchId: sermon.churchId,
        startDateTime: sermon.startDateTime,
        status: "End"
      }))
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to check live sermons", details: error.message });
  }
};






export const getLiveSermon = async (req, res) => {
  try {
    // Fetch live sermons
    const liveSermons = await Sermon.find({ status: "Live" });

    console.log("Live Sermons:", JSON.stringify(liveSermons, null, 2));

    // Extract unique adminStaffUserIds
    const adminStaffUserIds = [...new Set(liveSermons.map(sermon => sermon.adminStaffUserId).filter(id => id))];

    console.log("Extracted Admin Staff User IDs:", adminStaffUserIds);

    if (!adminStaffUserIds.length) {
      return res.status(404).json({ message: "No admin staff found for live sermons" });
    }

    // Fetch admin staff users from User collection
    const adminStaffUsers = await User.find({ _id: { $in: adminStaffUserIds } }).select('_id firstName lastName');

    console.log("Admin Staff Users from DB:", adminStaffUsers);

    if (!adminStaffUsers.length) {
      return res.status(404).json({ message: "No matching admin staff found in the User collection" });
    }

    // Create a map for easy lookup
    const adminStaffMap = new Map(adminStaffUsers.map(user => [user._id.toString(), user]));

    // Attach admin staff details to each sermon
    const response = liveSermons.map(sermon => {
      const adminUser = adminStaffMap.get(sermon.adminStaffUserId?.toString());
      return {
        ...sermon.toObject(),
        adminStaff: adminUser ? { firstName: adminUser.firstName, lastName: adminUser.lastName } : null
      };
    });

    console.log("Final Response:", response);

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching live sermons:", error);
    res.status(500).json({ error: "Failed to fetch live sermons", details: error.message });
  }
};






// // API to End All Live Sermons
// export const endAllLiveSermons = async (req, res) => {
//   try {
//     // Find all sermons with status "Live"
//     const liveSermons = await Sermon.find({ status: "Live" });

//     if (liveSermons.length === 0) {
//       return res.status(200).json({ message: "No live sermons found." });
//     }

//     // Update all live sermons to "End"
//     await Sermon.updateMany({ status: "Live" }, { status: "End" });

//     res.status(200).json({ message: "All live sermons have been ended successfully." });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update sermons", details: error.message });
//   }
// };



