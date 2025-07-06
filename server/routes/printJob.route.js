import express from 'express';
import { createPrintJob, getPendingPrintJob, markPrintJobStatus } from '../controllers/order.controller.js';

const router = express.Router();
router.get('/test', (req, res) => {
  res.send("✅ PrintJob route file is working");
});

router.get('/get-print-job', getPendingPrintJob);
router.post('/mark-job-printed', markPrintJobStatus);

export default router;
