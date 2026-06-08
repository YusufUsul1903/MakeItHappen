import Task from '../models/Task.js';
import Category from '../models/Category.js';

export const getDashboard = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate('category', 'name color')
            .sort({ completed: 1, createdAt: -1 });

        const categories = await Category.find().sort({ createdAt: 1 });

        res.render('pages/index', {
            title: 'Make It Happen — Dashboard',
            tasks,
            categories,
            activeCategoryId: null
        });
    } catch (err) {
        res.status(500).send('Er ging iets mis bij het laden van de taken.');
    }
};

export const getTasksByCategory = async (req, res) => {
    try {
        const tasks = await Task.find({ category: req.params.id })
            .populate('category', 'name color')
            .sort({ completed: 1, createdAt: -1 });

        const categories = await Category.find().sort({ createdAt: 1 });

        res.render('pages/index', {
            title: 'Make It Happen — Categorie',
            tasks,
            categories,
            activeCategoryId: req.params.id
        });
    } catch (err) {
        res.status(500).send('Er ging iets mis bij het laden van deze categorie.');
    }
};

export const createTask = async (req, res) => {
    try {
        const { title, category } = req.body;

        if (!title?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Titel is verplicht'
            });
        }

        const task = await Task.create({
            title: title.trim(),
            category: category || null
        });

        await task.populate('category', 'name color');

        res.status(201).json({
            success: true,
            task
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const updateTask = async (req, res) => {
    try {
        const allowedUpdates = {};

        if (req.body.title !== undefined) {
            if (!req.body.title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Titel mag niet leeg zijn'
                });
            }

            allowedUpdates.title = req.body.title.trim();
        }

        if (req.body.completed !== undefined) {
            allowedUpdates.completed = req.body.completed;
        }

        if (req.body.category !== undefined) {
            allowedUpdates.category = req.body.category || null;
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: allowedUpdates },
            { new: true, runValidators: true }
        ).populate('category', 'name color');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Taak niet gevonden'
            });
        }

        res.json({
            success: true,
            task
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Taak niet gevonden'
            });
        }

        res.json({
            success: true,
            message: 'Taak verwijderd'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name, color } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Categorienaam is verplicht'
            });
        }

        const category = await Category.create({
            name: name.trim(),
            color: color || '#3B6D11'
        });

        res.status(201).json({
            success: true,
            category
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        await Task.updateMany(
            { category: req.params.id },
            { $set: { category: null } }
        );

        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Categorie niet gevonden'
            });
        }

        res.json({
            success: true,
            message: 'Categorie verwijderd'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};