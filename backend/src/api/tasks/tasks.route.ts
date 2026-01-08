import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  completeTask,
  deleteTask,
  createTaskValidation,
  updateTaskValidation
} from './tasks.controller';
import { authenticate } from '@/middlewares/auth';

const router: Router = Router();

// All task routes require authentication
router.use(authenticate);

router.post('/', createTaskValidation, createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTaskValidation, updateTask);
router.patch('/:id/complete', completeTask);
router.delete('/:id', deleteTask);

export default router;