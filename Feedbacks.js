const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    response: { type: String, default: '' },
  },
  { timestamps: true }  // Automatically add `createdAt` and `updatedAt`
);

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
