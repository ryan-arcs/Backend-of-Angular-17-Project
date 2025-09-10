import express from 'express';
import { createAsherApplicationHandler, deleteAsherApplicationHandler, getAsherApplicationHandler, listAsherApplicationsHandler, listAuthorityUsersHandler, listItContactUsersHandler, updateAsherApplicationHandler } from '../../controllers';

const router = express.Router();

router.get('/', listAsherApplicationsHandler);
router.get('/authorities', listAuthorityUsersHandler);
router.get('/itcontacts', listItContactUsersHandler);
router.get('/:id', getAsherApplicationHandler);
router.post('/', createAsherApplicationHandler);
router.put('/', updateAsherApplicationHandler);
router.delete('/:id', deleteAsherApplicationHandler);

export default router;