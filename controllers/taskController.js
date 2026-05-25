import Task from '../models/Task.js';
import Category from '../models/Category.js';

export const getDashboard = async (req, res) => {
    const tasks = await Task.find()
        .populate('category', 'name color')
        .sort({ completed: 1, createdAt: -1 });

    const categories = await Category.find().sort({ createdAt: 1 });

    res.render('pages/index', {
        title: 'Nudge — Dashboard',
        tasks,
        categories,
        activeCategoryId: null
    });
};

export const createTask = async (req, res) => {
    try {
        const { title, category } = req.body;
        if (!title?.trim()) return res.status(400).json({ success: false, message: 'Titel is verplicht' });

        const task = await Task.create({
            title: title.trim(),
            category: category || null
        });
        await task.populate('category', 'name color');

        res.status(201).json({ success: true, task });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).populate('category', 'name color');

        if (!task) return res.status(404).json({ success: false, message: 'Taak niet gevonden' });
        res.json({ success: true, task });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: 'Taak niet gevonden' });
        res.json({ success: true, message: 'Taak verwijderd' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};