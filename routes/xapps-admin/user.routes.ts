import express from 'express';
import { createUserHandler, getUserHandler, listUsersHandler, updateUserHandler, userRoleListHandler, userRolesHandler, userSpecialPermissionHandler, userSpecialPermissionListHandler } from '../../controllers';

const router = express.Router();

router.get('/', listUsersHandler);
router.get('/:id', getUserHandler);
router.post('/', createUserHandler);
router.put('/', updateUserHandler);
router.put('/:id/manage-roles', userRolesHandler);
router.get('/:id/assigned-roles', userRoleListHandler);
router.put('/:id/manage-special-permissions', userSpecialPermissionHandler);
router.get('/:id/assigned-special-permissions', userSpecialPermissionListHandler);

export default router;