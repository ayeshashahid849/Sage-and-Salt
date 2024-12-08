const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            ItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
            quantity: { type: Number, required: true },
            customizations: { type: String, default: '' },
        },
    ],
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }, // Staff handling the order
    totalPrice: { type: Number, required: true },
    tracking: {
        status: { type: String, enum: ['Preparing', 'Ready', 'Delivered'], default: 'Preparing' },
        lastUpdated: { type: Date, default: Date.now },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
