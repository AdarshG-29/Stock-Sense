import {Router} from 'express';
import { getUser, loginUser, logoutUser, registerUser } from '../controllers/auth.controller';
import authMiddleware from '../middlewares/auth.middleware';
import { LOGIN_PATH, LOGOUT_PATH, REGISTER_PATH, USER_PATH } from '../config/apiPaths';

const router = Router();
router.post(REGISTER_PATH, registerUser);
router.post(LOGIN_PATH, loginUser);
router.post(LOGOUT_PATH,logoutUser);
router.get(USER_PATH, authMiddleware, getUser)

export default router;