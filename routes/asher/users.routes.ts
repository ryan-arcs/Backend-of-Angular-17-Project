import express from 'express';
import { getAsherUserHandler, listAsherUsersHandler } from '../../controllers';

const router = express.Router();

router.get('/', listAsherUsersHandler);
router.get('/:email', getAsherUserHandler);

export default router;