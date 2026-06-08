import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';

const createToken = userId => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

export const getLogin = (req, res) => {
    res.render('pages/log-in', {
        title: 'Make It Happen — Log in',
        errors: [],
        oldInput: {}
    });
};

export const getRegister = (req, res) => {
    res.render('pages/register', {
        title: 'Make It Happen — Registreer',
        errors: [],
        oldInput: {}
    });
};

export const getForgotPassword = (req, res) => {
    res.render('pages/forgot-password', {
        title: 'Make It Happen — Wachtwoord vergeten'
    });
};

export const register = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('pages/register', {
            title: 'Make It Happen — Registreer',
            errors: errors.array(),
            oldInput: req.body
        });
    }

    try {
        const { fullName, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(422).render('pages/register', {
                title: 'Make It Happen — Registreer',
                errors: [{ msg: 'Er bestaat al een account met dit e-mailadres.' }],
                oldInput: req.body
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await User.create({
            fullName,
            email,
            password: hashedPassword
        });

        res.redirect('/login');
    } catch (err) {
        res.status(500).send('Er ging iets mis bij het registreren.');
    }
};

export const login = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('pages/log-in', {
            title: 'Make It Happen — Log in',
            errors: errors.array(),
            oldInput: req.body
        });
    }

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).render('pages/log-in', {
                title: 'Make It Happen — Log in',
                errors: [{ msg: 'Ongeldige e-mail of wachtwoord.' }],
                oldInput: req.body
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).render('pages/log-in', {
                title: 'Make It Happen — Log in',
                errors: [{ msg: 'Ongeldige e-mail of wachtwoord.' }],
                oldInput: req.body
            });
        }

        const token = createToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.redirect('/');
    } catch (err) {
        res.status(500).send('Er ging iets mis bij het aanmelden.');
    }
};

export const logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
};