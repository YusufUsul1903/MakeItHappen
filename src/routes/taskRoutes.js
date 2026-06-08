import express from 'express';
import * as taskController from '../controllers/taskController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', requireAuth, taskController.getDashboard);
router.get('/category/:id', requireAuth, taskController.getTasksByCategory);

router.post('/api/tasks', requireAuth, taskController.createTask);
router.patch('/api/tasks/:id', requireAuth, taskController.updateTask);
router.delete('/api/tasks/:id', requireAuth, taskController.deleteTask);

router.post('/api/categories', requireAuth, taskController.createCategory);
router.delete('/api/categories/:id', requireAuth, taskController.deleteCategory);

export default router;