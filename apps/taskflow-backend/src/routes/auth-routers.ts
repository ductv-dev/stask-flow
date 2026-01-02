import express from 'express';
import { getUserProfile, loginUser, loginWithGoogle, registerUser } from '../controllers/auth-controller';
import { protect } from '../middleware/auth-middleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser); 

router.get('/profile', protect, getUserProfile);
router.post("/google", loginWithGoogle);

export default router;