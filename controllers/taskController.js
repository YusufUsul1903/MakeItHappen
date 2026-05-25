export const getDashboard = (req, res) => {
    const tasks = [
        { _id: '1', title: 'Website stylen', completed: false },
        { _id: '2', title: 'Database opzetten', completed: false },
        { _id: '3', title: 'EJS implementeren', completed: true }
    ];

    const categories = [];

    res.render('pages/index', {
        title: 'Nudge — Dashboard',
        tasks: tasks,
        categories: categories,
        activeCategoryId: null
    });
};