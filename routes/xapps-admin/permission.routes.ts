import express from 'express';
import { createPermissionHandler, deletePermissionHandler, getPermissionHandler, listPermissionsHandler, updatePermissionHandler } from '../../controllers';

const router = express.Router();

router.get('/', listPermissionsHandler);
router.post('/', createPermissionHandler);
router.put('/', updatePermissionHandler);
router.get('/:id', getPermissionHandler);
router.delete('/:id', deletePermissionHandler);

export default router;