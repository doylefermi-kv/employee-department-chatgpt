import express from 'express';
import { LoginController } from '../controller/login.controller';

const router = express.Router();

const loginController = new LoginController();

router.post('/signup', loginController.signUp);
router.post('/signin', loginController.signIn);

export { router as loginRouter };
