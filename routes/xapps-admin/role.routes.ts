import express from 'express';
import { listRolesHandler, rolePermissionListHandler, rolePermissionsHandler, createRoleHandler, getRoleHandler, updateRoleHandler, deleteRoleHandler, roleUsersHandler, roleUserListHandler } from '../../controllers';

const router = express.Router();

router.get('/', listRolesHandler);
router.post('/', createRoleHandler);
router.put('/', updateRoleHandler);
router.delete('/:id', deleteRoleHandler);
router.get('/:id', getRoleHandler);
router.put('/:id/manage-permissions', rolePermissionsHandler);
router.get('/:id/assigned-permissions', rolePermissionListHandler);
router.put('/:id/manage-users', roleUsersHandler);
router.get('/:id/assigned-users', roleUserListHandler);

export default router;