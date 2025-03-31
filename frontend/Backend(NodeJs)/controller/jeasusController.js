import JesusClick from '../model/jeasusClicked.js';


export const clickJesus = async (req, res) => {
    try {
        let { userId, sermonId, jesusClicked } = req.body;

        if (!userId || !sermonId) {
            return res.status(400).json({ message: "User ID and Sermon ID are required" });
        }

        if (typeof jesusClicked !== "string" || (jesusClicked !== "Yes" && jesusClicked !== "No")) {
            return res.status(400).json({ message: "jesusClicked must be 'Yes' or 'No' as a string" });
        }

        // ✅ Check if the user has already clicked
        const existingClick = await JesusClick.findOne({ userId, sermonId });

        if (existingClick) {
            // ✅ Increase count if user clicks again
            existingClick.count += 1;
            existingClick.jesusClicked = jesusClicked; // Update the value
            await existingClick.save();
        } else {
            // ✅ Create a new record with count = 1
            await JesusClick.create({ userId, sermonId, jesusClicked, count: 1 });
        }

        res.status(200).json({ message: "Jesus click updated successfully" });
    } catch (error) {
        console.error("Error updating Jesus Click:", error);
        res.status(500).json({ message: "Server error", error });
    }
};



export const getAllJesusClicks = async (req, res) => {
    try {
        // Fetch only users who clicked "Yes" (true)
        const clicks = await JesusClick.find({ jesusClicked: true })
            .populate('userId', 'firstName lastName email phone')
            .populate('sermonId', 'sermonName');

        res.status(200).json(clicks);
    } catch (error) {
        console.error("Error fetching Jesus Clicks:", error);
        res.status(500).json({ message: 'Server error', error });
    }
};

/**
 * Get Jesus Clicks for a Specific Sermon
 */
export const getJesusClicksBySermon = async (req, res) => {
    try {
        const { sermonId } = req.params;

        const clicks = await JesusClick.find({ sermonId }).populate('userId', 'firstName lastName email');

        res.status(200).json(clicks);
    } catch (error) {
        console.error("Error fetching Jesus Clicks for sermon:", error);
        res.status(500).json({ message: 'Server error', error });
    }
};

/**
 * Get Jesus Clicks for a Specific User
 */
export const getJesusClicksByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const clicks = await JesusClick.find({ userId }).populate('sermonId', 'sermonName');

        res.status(200).json(clicks);
    } catch (error) {
        console.error("Error fetching Jesus Clicks for user:", error);
        res.status(500).json({ message: 'Server error', error });
    }
};
