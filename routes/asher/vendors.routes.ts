import express from 'express';
import { createVendorHandler, deleteVendorHandler, getVendorHandler, listVendorsHandler, updateVendorHandler } from '../../controllers';

const router = express.Router();

router.get('/', listVendorsHandler);
router.get('/:id', getVendorHandler);
router.post('/', createVendorHandler);
router.put('/', updateVendorHandler);
router.delete('/:id', deleteVendorHandler);

export default router;