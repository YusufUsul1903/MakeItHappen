import express from 'express';
import { body, param } from 'express-validator';
import * as taskController from '../controllers/taskController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/', requireAuth, taskController.getDashboard);
router.get('/category/:id', requireAuth, taskController.getTasksByCategory);
router.get('/api/tasks', requireAuth, taskController.getTasks);

router.get(
    '/api/tasks/:id',
    requireAuth,
    [
        param('id')
            .isMongoId()
            .withMessage('Ongeldige taak.')
    ],
    handleValidationErrors,
    taskController.getTaskById
);

router.get('/api/categories', requireAuth, taskController.getCategories);

router.get(
    '/api/categories/:id',
    requireAuth,
    [
        param('id')
            .isMongoId()
            .withMessage('Ongeldige categorie.')
    ],
    handleValidationErrors,
    taskController.getCategoryById
);

router.post(
    '/api/tasks',
    requireAuth,
    [
        body('title')
            .trim()
            .notEmpty()
            .withMessage('Titel is verplicht.')
            .isLength({ max: 200 })
            .withMessage('Titel mag maximum 200 tekens bevatten.'),

        body('category')
            .optional({ nullable: true, checkFalsy: true })
            .isMongoId()
            .withMessage('Ongeldige categorie.')
    ],
    handleValidationErrors,
    taskController.createTask
);

router.patch(
    '/api/tasks/:id',
    requireAuth,
    [
        param('id')
            .isMongoId()
            .withMessage('Ongeldige taak.'),

        body('title')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('Titel mag niet leeg zijn.')
            .isLength({ max: 200 })
            .withMessage('Titel mag maximum 200 tekens bevatten.'),

        body('completed')
            .optional()
            .isBoolean()
            .withMessage('Completed moet true of false zijn.'),

        body('category')
            .optional({ nullable: true, checkFalsy: true })
            .isMongoId()
            .withMessage('Ongeldige categorie.')
    ],
    handleValidationErrors,
    taskController.updateTask
);

router.delete(
    '/api/tasks/:id',
    requireAuth,
    [
        param('id')
            .isMongoId()
            .withMessage('Ongeldige taak.')
    ],
    handleValidationErrors,
    taskController.deleteTask
);

router.post(
    '/api/categories',
    requireAuth,
    [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Categorienaam is verplicht.')
            .isLength({ max: 50 })
            .withMessage('Categorienaam mag maximum 50 tekens bevatten.'),

        body('color')
            .optional()
            .matches(/^#[0-9A-Fa-f]{6}$/)
            .withMessage('Ongeldige kleurcode.')
    ],
    handleValidationErrors,
    taskController.createCategory
);

router.delete(
    '/api/categories/:id',
    requireAuth,
    [
        param('id')
            .isMongoId()
            .withMessage('Ongeldige categorie.')
    ],
    handleValidationErrors,
    taskController.deleteCategory
);

export default router;