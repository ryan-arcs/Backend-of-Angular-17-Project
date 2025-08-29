import express from 'express';
import { loginHandler, profileHandler, themeHandler } from '../controllers';
import { auth } from '../middleware';

const router = express.Router();

router.post('/login', loginHandler);
router.get('/me', auth, profileHandler);
router.put('/update-theme', themeHandler);

export default router;