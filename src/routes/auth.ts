import {Router} from 'express';
import { getUser, loginUser, logoutUser, registerUser } from '../controllers/authController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout',logoutUser);
router.get('/user', authMiddleware, getUser)

export default router;