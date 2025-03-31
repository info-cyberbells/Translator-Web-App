import express from 'express';

import { addUser, fetchAllUser, detailUser, verifyResetCodeAndChangePassword, requestResetPassword,  editUser, deleteUser,getDeleteRequestStatus, updateDeleteRequest, getDeleteRequests, fetchUserType, requestDeleteUser,  countUserByType} from '../controller/userController.js';
import {  updateProfile, changePassword, uploadProfileImage, upload,  Profile } from '../controller/userProfileController.js';

import {  updateProfileWeb, changePasswordWeb, uploadProfileImageWeb } from '../controller/userProfileWebController.js';

const routerUser = express.Router();

// Authentication Routes
routerUser.post('/add', addUser);

// User Routes
routerUser.get('/fetchAll', fetchAllUser);          
routerUser.get('/detail/:id', detailUser);    
routerUser.post('/request-delete', requestDeleteUser); 
routerUser.get('/delete-requests', getDeleteRequests);
routerUser.get('/delete-request-status/:userId', getDeleteRequestStatus);
routerUser.patch('/delete-request/:requestId', updateDeleteRequest);
routerUser.delete('/delete/:id', deleteUser);    
routerUser.patch('/edit/:id', editUser);  


routerUser.post('/resetPassword', requestResetPassword);
routerUser.post('/verifyResetCode', verifyResetCodeAndChangePassword);

routerUser.get('/:type', fetchUserType);

//profile management
// routerUser.get('/profile/:id', viewProfile);
routerUser.patch('/profile-update/:id', upload.single('image'), Profile);
routerUser.patch('/change-password/:id', changePasswordWeb);
routerUser.patch('/profile/:id', uploadProfileImage, updateProfile);
routerUser.get('/counts/:type', countUserByType);
routerUser.patch('/change/password/:id/', changePassword);



export default routerUser;
