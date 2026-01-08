import { Router } from 'express';
import {
  register,
  login,
  registerValidation,
  loginValidation
} from './auth.controller';

const router: Router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

export default router;