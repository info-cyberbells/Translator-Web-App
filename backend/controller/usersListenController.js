import mongoose from 'mongoose';
import UsersListen from '../model/usersListen.js'
import Sermon from '../model/sermonModel.js';
import User from '../model/authModel.js';
import moment from 'moment-timezone';
import Church from '../model/churchModel.js';
import JesusClick from '../model/jeasusClicked.js';

// Create a new usersListen entry when joining sermon
export const createUsersListen = async (req, res) => {
    try {
        const { churchId, sermonId, userId, startDateTime, status, jesusClicked } = req.body;

        // Convert startDateTime to ACST (UTC+9:30)
        const startACST = startDateTime
            ? moment.utc(startDateTime).tz('Australia/Adelaide').toDate()
            : moment.utc().tz('Australia/Adelaide').toDate();

        const newUsersListen = new UsersListen({
            churchId,
            sermonId,
            userId,
            startDateTime: startACST,
            status: status || 'Live',
            jesusClicked: jesusClicked || "No"
        });

        await newUsersListen.save();
        res.status(201).json(newUsersListen);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update usersListen when leaving sermon
export const updateUsersListen = async (req, res) => {
    try {
        const { endDateTime, status } = req.body;

        // Convert endDateTime to ACST
        const endACST = endDateTime
            ? moment.utc(endDateTime).tz('Australia/Adelaide').toDate()
            : moment.utc().tz('Australia/Adelaide').toDate();

        const updatedUsersListen = await UsersListen.findByIdAndUpdate(
            req.params.id,
            {
                endDateTime: endACST,
                status: status || 'End'
            },
            { new: true }
        );

        if (!updatedUsersListen) return res.status(404).json({ message: 'Entry not found' });
        res.status(200).json(updatedUsersListen);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Keep other controllers as they are
// export const getAllUsersListen = async (req, res) => {
//     try {
//         const usersListens = await UsersListen.find();
//         res.status(200).json(usersListens); // Always return 200 with data (even if empty)
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// };




// Get all users who have listened to a sermon and check if they clicked "JesusClicked"
export const getAllUsersListen = async (req, res) => {
    try {
        console.log("Fetching users who listened with status 'End'...");

        const usersListens = await UsersListen.find({ status: "End" });
        if (usersListens.length === 0) {
            return res.status(200).json({ message: "No users listened to any sermons yet", data: [] });
        }

        const sermonIds = [...new Set(usersListens.map(user => user.sermonId?.toString()).filter(Boolean))];
        const userIds = [...new Set(usersListens.map(user => user.userId?.toString()).filter(Boolean))];

        const sermons = await Sermon.find({ _id: { $in: sermonIds }, status: { $ne: "Live" } });
        const adminStaffIds = [...new Set(sermons.map(sermon => sermon.adminStaffUserId?.toString()).filter(Boolean))];
        const churchIds = [...new Set(sermons.map(sermon => sermon.churchId?.toString()).filter(Boolean))];

        const adminStaffUsers = await User.find({ _id: { $in: adminStaffIds } }, { firstName: 1, lastName: 1, email: 1, phone: 1 });
        const listeningUsers = await User.find({ _id: { $in: userIds } }, { firstName: 1, lastName: 1, email: 1, phone: 1 });
        const churches = await Church.find({ _id: { $in: churchIds } }, { name: 1, address: 1, city: 1, state: 1, country: 1, senior_pastor_name: 1 });

        // Fetch Jesus Click data
        const jesusClicks = await JesusClick.find({ userId: { $in: userIds } });

        const sermonDetails = sermons.map(sermon => {
            const admin = adminStaffUsers.find(user => user?._id?.toString() === sermon.adminStaffUserId?.toString());
            const church = churches.find(ch => ch?._id?.toString() === sermon.churchId?.toString());

            const listeners = usersListens
                .filter(userListen => userListen.sermonId?.toString() === sermon._id?.toString())
                .map(userListen => {
                    const user = listeningUsers.find(user => user?._id?.toString() === userListen.userId?.toString());
                    const clickedJesus = jesusClicks.some(jc => 
                        jc.userId?.toString() === userListen.userId?.toString() && 
                        jc.sermonId?.toString() === sermon._id?.toString()
                    );

                    return {
                        userId: userListen.userId,
                        userName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
                        userEmail: user ? user.email : 'Unknown',
                        userPhone: user ? user.phone : 'Unknown',
                        startDateTime: userListen.startDateTime || 'N/A',
                        endDateTime: userListen.endDateTime || 'N/A',
                        jesusClicked: clickedJesus
                    };
                });

            return {
                sermonId: sermon._id,
                sermonName: sermon.sermonName,
                adminName: admin ? `${admin.firstName} ${admin.lastName}` : 'Unknown',
                adminPhone: admin ? admin.phone : 'Unknown',
                
                SermonStartDateTime: sermon.startDateTime,
                
                
                churchName: church ? church.name : 'Unknown',
                listeners: listeners
            };
        });

        res.status(200).json(sermonDetails);
    } catch (error) {
        console.error("Error fetching users and sermons:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


// Get live users who have listened and check for Jesus Clicks
export const getLiveUsersListen = async (req, res) => {
    try {
        const usersListensLive = await UsersListen.find({ status: { $in: ["Live", "End"] } });
        const sermonIdsLive = [...new Set(usersListensLive.map(user => user.sermonId?.toString()).filter(Boolean))];
        const userIdsLive = [...new Set(usersListensLive.map(user => user.userId?.toString()).filter(Boolean))];

        const allSermons = await Sermon.find({ _id: { $in: sermonIdsLive } }, { sermonName: 1, startDateTime: 1, endDateTime: 1, adminStaffUserId: 1, churchId: 1, status: 1 });
        const endedSermons = allSermons.filter(sermon => sermon.status === "End");

        for (const sermon of endedSermons) {
            await UsersListen.updateMany(
                { sermonId: sermon._id, status: "Live" },
                { $set: { endDateTime: sermon.endDateTime, status: "End" } }
            );
        }

        const sermonsLive = allSermons.filter(sermon => sermon.status !== "End");
        if (sermonsLive.length === 0) {
            return res.status(200).json([]);
        }

        const adminStaffIdsLive = [...new Set(sermonsLive.map(sermon => sermon.adminStaffUserId?.toString()).filter(Boolean))];
        const churchIdsLive = [...new Set(sermonsLive.map(sermon => sermon.churchId?.toString()).filter(Boolean))];

        const adminStaffUsers = await User.find({ _id: { $in: adminStaffIdsLive } }, { firstName: 1, lastName: 1, email: 1 });
        const listeningUsers = await User.find({ _id: { $in: userIdsLive } }, { firstName: 1, lastName: 1, email: 1 });
        const churches = await Church.find({ _id: { $in: churchIdsLive } }, { name: 1, address: 1, city: 1, state: 1, country: 1, senior_pastor_name: 1 });

        // Fetch Jesus Click data
        const jesusClicksLive = await JesusClick.find({ userId: { $in: userIdsLive } });

        const sermonDetailsLive = sermonsLive.map(sermon => {
            const admin = adminStaffUsers.find(user => user?._id?.toString() === sermon.adminStaffUserId?.toString());
            
            // Fixed the problematic line to safely handle undefined values
            const church = churches.find(ch => 
                ch && ch._id && sermon.churchId && 
                ch._id.toString() === sermon.churchId.toString()
            );

            const sermonListeners = usersListensLive.filter(userListen => 
                userListen.sermonId && sermon._id && 
                userListen.sermonId.toString() === sermon._id.toString()
            );

            const activeListeners = sermonListeners.filter(listener => listener.status === "Live");
            const inactiveListeners = sermonListeners.filter(listener => listener.status === "End");

            const listeners = sermonListeners.map(userListen => {
                const user = listeningUsers.find(user => 
                    user && user._id && userListen.userId && 
                    user._id.toString() === userListen.userId.toString()
                );
                
                const clickedJesus = jesusClicksLive.some(jc => 
                    jc && jc.userId && jc.sermonId && userListen.userId && sermon._id &&
                    jc.userId.toString() === userListen.userId.toString() && 
                    jc.sermonId.toString() === sermon._id.toString()
                );

                return {
                    userId: userListen.userId,
                    userName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
                    userEmail: user ? user.email : 'Unknown',
                    startDateTime: userListen.startDateTime || 'N/A',
                    endDateTime: userListen.endDateTime || 'N/A',
                    status: userListen.status,
                    jesusClicked: clickedJesus
                };
            });

            return {
                sermonId: sermon._id,
                sermonName: sermon.sermonName,
                adminName: admin ? `${admin.firstName} ${admin.lastName}` : 'Unknown',
                churchName: church ? church.name : 'Unknown',
                SermonStartDateTime: sermon.startDateTime,

                sermonStatus: sermon.status,
                listeners: listeners,
                totalListeners: sermonListeners.length,
                activeListeners: activeListeners.length,
                inactiveListeners: inactiveListeners.length
            };
        });

        res.status(200).json(sermonDetailsLive);
    } catch (error) {
        console.error("Error fetching live users and sermons:", error);
        res.status(500).json({ message: 'Server error', error });
    }
};



export const getAllUsers = async (req, res) => {
    try {
        console.log("Fetching users who have clicked Jesus...");

        // Step 1: Get userIds and their click counts from JesusClick collection
        const jesusClickUsers = await JesusClick.aggregate([
            {
                $group: {
                    _id: "$userId",
                    totalClicks: { $sum: "$count" } // ✅ Sum up all clicks per user
                }
            }
        ]);

        if (jesusClickUsers.length === 0) {
            return res.status(200).json({ message: "No users have clicked Jesus", data: [] });
        }

        // Step 2: Find users that match those userIds
        const userIds = jesusClickUsers.map(user => user._id);
        const users = await User.find(
            { _id: { $in: userIds } },
            { firstName: 1, lastName: 1, email: 1, phone: 1, address: 1, city: 1, state: 1, country: 1 }
        );

        // Step 3: Attach click count to each user
        const userData = users.map(user => {
            const clickData = jesusClickUsers.find(jc => jc._id.toString() === user._id.toString());
            return {
                ...user.toObject(),
                jesusClickCount: clickData ? clickData.totalClicks : 0 // ✅ Attach count
            };
        });

        res.status(200).json({ message: "Users who clicked Jesus fetched successfully", data: userData });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error", error });
    }
};





export const getUsersListenById = async (req, res) => {
    try {
        const usersListen = await UsersListen.findById(req.params.id).populate('churchId sermonId');
        if (!usersListen) return res.status(404).json({ message: 'Entry not found' });
        res.status(200).json(usersListen);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




export const deleteUsersListen = async (req, res) => {
    try {
        const deletedUsersListen = await UsersListen.findByIdAndDelete(req.params.id);
        if (!deletedUsersListen) return res.status(404).json({ message: 'Entry not found' });
        res.status(200).json({ message: 'Entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




