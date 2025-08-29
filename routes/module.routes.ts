import express from 'express';
import { createModuleHandler, deleteModuleHandler, getModuleHandler, listModulesHandler, updateModuleHandler } from '../controllers';

const router = express.Router();

router.get('/', listModulesHandler);
router.post('/', createModuleHandler);
router.put('/', updateModuleHandler);
router.get('/:id', getModuleHandler);
router.delete('/:id', deleteModuleHandler);

export default router;