import Task from '../models/Task.js';
import Category from '../models/Category.js';

export const getDashboard = async (req, res) => {
    try {
        const tasks = await Task.query()
            .where('user_id', req.user.id)
            .withGraphFetched('category')
            .orderBy('completed', 'asc')
            .orderBy('created_at', 'desc');

        const categories = await Category.query()
            .where('user_id', req.user.id)
            .orderBy('created_at', 'asc');

        res.render('pages/index', {
            title: 'Make It Happen — Dashboard',
            tasks,
            categories,
            activeCategoryId: null,
            user: req.user
        });
    } catch (err) {
        console.error('Dashboard fout:', err);

        res.status(500).send(
            'Er ging iets mis bij het laden van de taken.'
        );
    }
};

export const getTasksByCategory = async (req, res) => {
    try {
        const tasks = await Task.query()
            .where('user_id', req.user.id)
            .where('category_id', req.params.id)
            .withGraphFetched('category')
            .orderBy('completed', 'asc')
            .orderBy('created_at', 'desc');

        const categories = await Category.query()
            .where('user_id', req.user.id)
            .orderBy('created_at', 'asc');

        res.render('pages/index', {
            title: 'Make It Happen — Categorie',
            tasks,
            categories,
            activeCategoryId: req.params.id,
            user: req.user
        });
    } catch (err) {
        console.error('Categorie fout:', err);

        res.status(500).send(
            'Er ging iets mis bij het laden van deze categorie.'
        );
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
            const existingCategory = await Category.query()
                .findOne({
                    id: Number(category),
                    user_id: req.user.id
                });

            if (!existingCategory) {
                return res.status(403).json({
                    success: false,
                    message: 'Deze categorie bestaat niet of is niet van jou.'
                });
            }
        }

        const task = await Task.query().insert({
            title: title.trim(),
            category_id: category ? Number(category) : null,
            user_id: req.user.id,
            completed: false
        });

        const taskWithCategory = await Task.query()
            .findById(task.id)
            .withGraphFetched('category');

        res.status(201).json({
            success: true,
            task: taskWithCategory
        });
    } catch (err) {
        console.error('Create task fout:', err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.query()
            .findOne({
                id: Number(req.params.id),
                user_id: req.user.id
            });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Taak niet gevonden'
            });
        }

        const updates = {};

        if (req.body.title !== undefined) {
            if (!req.body.title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Titel mag niet leeg zijn'
                });
            }

            updates.title = req.body.title.trim();
        }

        if (req.body.completed !== undefined) {
            updates.completed =
                req.body.completed === true ||
                req.body.completed === 'true';
        }

        if (req.body.category !== undefined) {
            if (req.body.category) {
                const existingCategory = await Category.query()
                    .findOne({
                        id: Number(req.body.category),
                        user_id: req.user.id
                    });

                if (!existingCategory) {
                    return res.status(403).json({
                        success: false,
                        message: 'Deze categorie bestaat niet of is niet van jou.'
                    });
                }

                updates.category_id = Number(req.body.category);
            } else {
                updates.category_id = null;
            }
        }

        await Task.query()
            .patch(updates)
            .where('id', task.id)
            .where('user_id', req.user.id);

        const updatedTask = await Task.query()
            .findById(task.id)
            .withGraphFetched('category');

        res.json({
            success: true,
            task: updatedTask
        });
    } catch (err) {
        console.error('Update task fout:', err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const deleted = await Task.query()
            .delete()
            .where('id', Number(req.params.id))
            .where('user_id', req.user.id);

        if (!deleted) {
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
        console.error('Delete task fout:', err);

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

        const category = await Category.query().insert({
            name: name.trim(),
            color: color || '#3B6D11',
            user_id: req.user.id
        });

        res.status(201).json({
            success: true,
            category
        });
    } catch (err) {
        console.error('Create category fout:', err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.query()
            .findOne({
                id: Number(req.params.id),
                user_id: req.user.id
            });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Categorie niet gevonden'
            });
        }

        await Task.query()
            .delete()
            .where('category_id', category.id)
            .where('user_id', req.user.id);

        await Category.query()
            .deleteById(category.id);

        res.json({
            success: true,
            message: 'Categorie en bijhorende taken verwijderd'
        });
    } catch (err) {
        console.error('Delete category fout:', err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.query()
            .where('user_id', req.user.id)
            .withGraphFetched('category')
            .orderBy('completed', 'asc')
            .orderBy('created_at', 'desc');

        res.json({
            success: true,
            tasks
        });
    } catch (err) {
        console.error('Get tasks fout:', err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const task = await Task.query()
            .findOne({
                id: Number(req.params.id),
                user_id: req.user.id
            })
            .withGraphFetched('category');

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
        console.error('Get task fout:', err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.query()
            .where('user_id', req.user.id)
            .orderBy('created_at', 'asc');

        res.json({
            success: true,
            categories
        });
    } catch (err) {
        console.error('Get categories fout:', err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.query()
            .findOne({
                id: Number(req.params.id),
                user_id: req.user.id
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
        console.error('Get category fout:', err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};