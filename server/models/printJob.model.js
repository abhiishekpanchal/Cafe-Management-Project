import mongoose from 'mongoose';

const printJobSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Order',
    },
    email: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'printed', 'failed'],
      default: 'pending',
    },
    printerIp: {
      type: String,
    },
  },
  { timestamps: true }
);

const PrintJob = mongoose.model('PrintJob', printJobSchema);
export default PrintJob;
