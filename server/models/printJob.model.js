import mongoose from 'mongoose';

const printJobSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  content: {
    type: String,
    required: true,
  },
  email: String, // used by printer helper app
  type: {
    type: String,
    enum: ['bill', 'kitchen'],
    default: 'bill',
  },
  status: {
    type: String,
    enum: ['pending', 'printed', 'error'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('PrintJob', printJobSchema);
