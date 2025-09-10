import express from 'express';
import { getAsherApplicationHandler, listAsherApplicationsHandler, listAuthorityUsersHandler, listItContactUsersHandler } from '../../controllers';

const router = express.Router();

router.get('/', listAsherApplicationsHandler);
router.get('/authorities', listAuthorityUsersHandler);
router.get('/itcontacts', listItContactUsersHandler);
router.get('/:id', getAsherApplicationHandler);

export default router;