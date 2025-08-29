import express from 'express';
import { createSubmoduleHandler, deleteSubModuleHandler, getSubmoduleHandler, listSubmodulesHandler, updateSubmoduleHandler } from '../controllers';

const router = express.Router();

router.get('/', listSubmodulesHandler);
router.post('/', createSubmoduleHandler);
router.put('/', updateSubmoduleHandler);
router.get('/:id', getSubmoduleHandler);
router.delete('/:id', deleteSubModuleHandler);

export default router;