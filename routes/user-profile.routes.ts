import express from 'express';
import { updateConfigHandler, updateThemeHandler, userProfileSyncHandler } from '../controllers';

const router = express.Router();

router.post('/sync', userProfileSyncHandler);
router.post('/update-theme', updateThemeHandler);
router.post('/update-config', updateConfigHandler);

export default router;