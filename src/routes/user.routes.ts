import { Router } from 'express';

import UserController from '../controllers/UserController';

import { validate } from '../middlewares/validation.middleware';

import { UserValidator } from '../validators/UserValidator';

const userRoutes = Router();

userRoutes.post(
    '/',                         
    validate(UserValidator.createUser), 
    UserController.create             
);

export { userRoutes };