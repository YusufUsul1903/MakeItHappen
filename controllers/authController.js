export const getLogin = (req, res) => {
    res.render('pages/log-in', {
        title: 'Make It Happen - Log In'
    });
};

export const getRegister = (req, res) => {
    res.render('pages/register', {
        title: 'Make It Happen - Register'
    });
};

export const getForgotPassword = (req, res) => {
    res.render('pages/forgot-password', {
        title: 'Make It Happen - Forgot Password'
    });
};