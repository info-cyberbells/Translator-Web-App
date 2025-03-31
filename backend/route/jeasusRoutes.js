import express from 'express';
import {
    clickJesus,
    getAllJesusClicks,
    getJesusClicksBySermon,
    getJesusClicksByUser
} from '../controller/jeasusController.js';

const router = express.Router();

// Create or Update Jesus Click
router.post('/addstatus', clickJesus);

// Get all Jesus Clicks
router.get('/getallstatus', getAllJesusClicks);

// Get Jesus Clicks by Sermon
router.get('/sermon/:sermonId', getJesusClicksBySermon);

// Get Jesus Clicks by User
router.get('/user/:userId', getJesusClicksByUser);

export default router;
