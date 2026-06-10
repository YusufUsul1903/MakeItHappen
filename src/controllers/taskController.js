import Task from '../models/Task.js';
import Category from '../models/Category.js';

export const getDashboard = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id })
            .populate('category', 'name color')
            .sort({ completed: 1, createdAt: -1 });

        const categories = await Category.find({ user: req.user._id })
            .sort({ createdAt: 1 });

        res.render('pages/index', {
            title: 'Make It Happen — Dashboard',
            tasks,
            categories,
            activeCategoryId: null,
            user: req.user
        });
    } catch (err) {
        res.status(500).send('Er ging iets mis bij het laden van de taken.');
    }
};

export const getTasksByCategory = async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user._id,
            category: req.params.id
        })
            .populate('category', 'name color')
            .sort({ completed: 1, createdAt: -1 });

        const categories = await Category.find({ user: req.user._id })
            .sort({ createdAt: 1 });

        res.render('pages/index', {
            title: 'Make It Happen — Categorie',
            tasks,
            categories,
            activeCategoryId: req.params.id,
            user: req.user
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

        if (category) {
            const existingCategory = await Category.findOne({
                _id: category,
                user: req.user._id
            });

            if (!existingCategory) {
                return res.status(403).json({
                    success: false,
                    message: 'Deze categorie bestaat niet of is niet van jou.'
                });
            }
        }

        const task = await Task.create({
            title: title.trim(),
            category: category || null,
            user: req.user._id
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
            if (req.body.category) {
                const existingCategory = await Category.findOne({
                    _id: req.body.category,
                    user: req.user._id
                });

                if (!existingCategory) {
                    return res.status(403).json({
                        success: false,
                        message: 'Deze categorie bestaat niet of is niet van jou.'
                    });
                }
            }

            allowedUpdates.category = req.body.category || null;
        }

        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id
            },
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
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

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
            color: color || '#3B6D11',
            user: req.user._id
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
        const category = await Category.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Categorie niet gevonden'
            });
        }

        await Task.deleteMany({
            category: req.params.id,
            user: req.user._id
        });

        await Category.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        res.json({
            success: true,
            message: 'Categorie en bijhorende taken verwijderd'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id })
            .populate('category', 'name color')
            .sort({ completed: 1, createdAt: -1 });

        res.json({
            success: true,
            tasks
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate('category', 'name color');

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

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user._id })
            .sort({ createdAt: 1 });

        res.json({
            success: true,
            categories
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Categorie niet gevonden'
            });
        }

        res.json({
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