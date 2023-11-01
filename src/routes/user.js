import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login } from '../controllers/userController.js';

const userRoutes = express.Router();

userRoutes.use(rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10
  }));

userRoutes.post('/register', register);
userRoutes.post('/login', login);

export default userRoutes;
