// routes/usersListenRoutes.js
import express from 'express';
import {
    createUsersListen,
    getAllUsersListen,
    getUsersListenById,
    updateUsersListen,
    deleteUsersListen,
    getLiveUsersListen,
    getAllUsers,
} from '../controller/usersListenController.js';

const routersListen = express.Router();

routersListen.post('/users', createUsersListen);
routersListen.get('/getallusers', getAllUsersListen);
routersListen.get('/getallliveusers', getLiveUsersListen);


routersListen.get("/usersfetch", getAllUsers); 

routersListen.get('/:id', getUsersListenById);
routersListen.put('/:id', updateUsersListen);
routersListen.delete('/:id', deleteUsersListen);






export default routersListen;