import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.get('/log-in', authController.getLogin);
router.get('/register', authController.getRegister);
router.get('/forgot-password', authController.getForgotPassword);

export default router;
