import { Router } from 'express';

import UserController from '../controllers/UserController';

//import { authMiddleware } from '../middlewares/authMiddleware';

import { validate } from '../middlewares/validation.middleware';

import { UserValidator } from '../validators/UserValidator';

const userRoutes = Router();

userRoutes.post(
    '/',                         
    validate(UserValidator.createUser), 
    UserController.create             
);
/*userRoutes.put(
    '/me', 
    authMiddleware,                        
    validate(UserValidator.updateUser), 
    UserController.updateUserProfile             
);*/
export { userRoutes };