import express from 'express';
import { listDepartmentsHandler } from '../../controllers';

const router = express.Router();

router.get('/', listDepartmentsHandler);

export default router;