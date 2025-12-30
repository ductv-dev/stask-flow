import express from 'express';
import { getUserProfile, loginUser, registerUser } from '../controllers/auth-controller';
import { protect } from '../middleware/auth-middleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser); 

router.get('/profile', protect, getUserProfile);

export default router;