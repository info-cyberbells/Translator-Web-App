import express from 'express';
import { addSermon, deleteSermon, getSermons, updateSermon, checkLiveSermons, getLiveSermon } from '../controller/sermonController.js';

const routerSermon = express.Router();

routerSermon.post('/add', addSermon);
routerSermon.get('/fetchAll', getSermons);

routerSermon.patch('/edit/:id', updateSermon);     
routerSermon.delete('/delete/:id', deleteSermon);

routerSermon.get('/checkLive', checkLiveSermons);
routerSermon.get('/checksermon', getLiveSermon);





export default routerSermon;





