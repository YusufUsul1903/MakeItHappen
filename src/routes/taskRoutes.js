import express from 'express';
import * as taskController from '../controllers/taskController.js';

const router = express.Router();

router.get('/', taskController.getDashboard);
router.get('/category/:id', taskController.getTasksByCategory);

router.post('/api/tasks', taskController.createTask);
router.patch('/api/tasks/:id', taskController.updateTask);
router.delete('/api/tasks/:id', taskController.deleteTask);

router.post('/api/categories', taskController.createCategory);
router.delete('/api/categories/:id', taskController.deleteCategory);

export default router;