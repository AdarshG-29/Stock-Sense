import {Router} from 'express';
import { getUser, loginUser, logoutUser, registerUser } from '../controllers/authController';
import authMiddleware from '../middlewares/authMiddleware';
import { LOGIN_PATH, LOGOUT_PATH, REGISTER_PATH, USER_PATH } from '../constants/apiEndPoints';

const router = Router();
router.post(REGISTER_PATH, registerUser);
router.post(LOGIN_PATH, loginUser);
router.post(LOGOUT_PATH,logoutUser);
router.get(USER_PATH, authMiddleware, getUser)

export default router;