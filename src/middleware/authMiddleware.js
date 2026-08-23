import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const requireAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            console.error('AUTH ERROR: geen token');
            return res.redirect('/login');
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.query()
            .findById(decoded.id)
            .select('id', 'full_name', 'email');

        if (!user) {
            console.error('AUTH ERROR: gebruiker niet gevonden');
            return res.redirect('/login');
        }

        req.user = user;

        next();
    } catch (err) {
        console.error('AUTH ERROR:', err);
        res.clearCookie('token');
        res.redirect('/login');
    }
};

export const redirectIfLoggedIn = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET);
            return res.redirect('/');
        } catch (err) {
            res.clearCookie('token');
        }
    }

    next();
};