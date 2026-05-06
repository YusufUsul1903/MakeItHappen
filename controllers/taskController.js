export const getDashboard = (req, res) => {
    const tasks = [
        { title: 'Website stylen', completed: false },
        { title: 'Database opzetten', completed: false },
        { title: 'EJS implementeren', completed: true }
    ];

    res.render('pages/index', {
        title: 'Make It Happen - Dashboard',
        tasks: tasks 
    });
};