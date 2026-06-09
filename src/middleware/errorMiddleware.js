export const notFound = (req, res, next) => {
    const error = new Error(`Route niet gevonden: ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    if (req.originalUrl.startsWith('/api')) {
        return res.status(statusCode).json({
            success: false,
            message: err.message || 'Er ging iets mis op de server.'
        });
    }

    res.status(statusCode).send(err.message || 'Er ging iets mis.');
};