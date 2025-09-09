import express from 'express';
import { createLifecycleHandler, deleteLifecycleHandler, getLifecycleHandler, listLifecyclesHandler, updateLifecycleHandler } from '../../controllers';

const router = express.Router();

router.get('/', listLifecyclesHandler);
router.get('/:code', getLifecycleHandler);
router.post('/', createLifecycleHandler);
router.put('/', updateLifecycleHandler);
router.delete('/:id', deleteLifecycleHandler);

export default router;