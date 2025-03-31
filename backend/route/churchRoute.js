import express from 'express';
import { addChurch, fetchAllChurch,  detailChurch, updateChurch, deleteChurch, countAllChurches } from '../controller/churchController.js';

const routerChurch = express.Router();

// Church Routes
routerChurch.post('/add', addChurch);         
routerChurch.get('/fetchAll', fetchAllChurch);             
routerChurch.get('/detail/:id', detailChurch);        
routerChurch.patch('/edit/:id', updateChurch);  
routerChurch.get('/count', countAllChurches);   

routerChurch.delete('/delete/:id', deleteChurch);  

export default routerChurch;
