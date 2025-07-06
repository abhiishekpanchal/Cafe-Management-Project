import express from 'express';
import { createPrintJob, getPendingPrintJob, markPrintJobStatus } from '../controllers/order.controller.js';

const router = express.Router();
router.post('/create-job', createPrintJob);
router.get('/get-print-job', getPendingPrintJob);
router.post('/mark-job-printed', markPrintJobStatus);

export default router;
