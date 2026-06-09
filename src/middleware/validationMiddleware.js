import { validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    return res.status(422).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array()
    });
};