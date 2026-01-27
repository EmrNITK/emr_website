import express from 'express';
import { login, logout, checkAuth } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/check-auth', auth, checkAuth);

export default router;