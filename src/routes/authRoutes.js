import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.get('/login', authController.getLogin);
router.get('/register', authController.getRegister);
router.get('/forgot-password', authController.getForgotPassword);

router.post(
    '/register',
    [
        body('fullName').trim().notEmpty().withMessage('Naam is verplicht.'),
        body('email').isEmail().withMessage('Geef een geldig e-mailadres op.'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Wachtwoord moet minstens 6 tekens bevatten.')
    ],
    authController.register
);

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Geef een geldig e-mailadres op.'),
        body('password').notEmpty().withMessage('Wachtwoord is verplicht.')
    ],
    authController.login
);

router.post('/logout', authController.logout);

export default router;