import express from 'express'
import { getPendingPrintJob, markPrintJobStatus } from '../controllers/order.controller.js'

const router = express.Router()
console.log('✅ Print job routes loaded')


router.get('/get-print-job', (req, res) => {
  console.log('🔥 Route hit with query:', req.query)
  res.status(200).json({ message: 'Route is working' })
})
router.post('/mark-job-printed', markPrintJobStatus)

export default router