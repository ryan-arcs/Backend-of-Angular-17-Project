import express from 'express';
import { createApplicationHandler, deleteApplicationHandler, getApplicationHandler, listApplicationsHandler, updateApplicationHandler } from '../../controllers';

const router = express.Router();

router.get('/', listApplicationsHandler);
router.post('/', createApplicationHandler);
router.put('/', updateApplicationHandler);
router.get('/:id', getApplicationHandler);
router.delete('/:id', deleteApplicationHandler);

export default router;