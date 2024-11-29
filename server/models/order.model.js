import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    cafeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cafe',
        required: true,
    }, 
    tableId: {
        type: Number,
        required: true,
    },
    customer: {
        type: String,
        required: true,
    },
    orderList: [
        {
            dishName: {
                type: String,
                required: true,
            },
            dishCategory: {
                type: String,
                required: true,
            },
            dishVariant: {
                type: String,
                required: true,
            },
            dishAddons: [{
                addonName: {
                    type: String,
                },
                addonPrice: {
                    type: Number,
                },
            }],
            quantity: {
                type: Number,
                required: true,
                default: 1, 
            },
            dishPrice: {
                type: Number,
                required: true, 
            },
            price: {
                type: Number,
                required: true,
            },
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
    },
    note: {
        type: String,
    },
}, {timestamps:true});

const Order = mongoose.model('Order', orderSchema);

export default Order;
