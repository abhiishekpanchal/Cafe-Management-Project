import mongoose from "mongoose";

const cafeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    tables: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    pin: {
        type: String,
    },
    categories: {
        type: Array,
        required: true,
        default: [],
    },
    addons: [
        {
            addon_name: {
                type: String,
            },
            addon_price: {
                type: Number,
            }, 
            addon_status: {
                type: Boolean,
                default: true,
            },
        },
    ],
    instagram: {
        type: String,
    },
    logoImg: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },
    banner: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    categoryImgs: [{
        categoryName: {
            type: String,
        },
        images: {
            public_id: {
                type: String,
            },
            url: {
                type: String,
            }
        }
    }],
    earnings: [{
        monthYear: { type: String }, 
        totalAmount: { type: Number, default: 0 },
        cash: { type: Number, default: 0 },
        upi: { type: Number, default: 0 },
        card: { type: Number, default: 0 },
        paid: { type: Number, default: 0 },
        cancelled: { type: Number, default: 0 },
    }],
    complains: [{
        complain: {
            type: String,
        },
        date: {
            type: Date,
        },
    }],
}, {timestamps: true});

const Cafe = mongoose.model('Cafe', cafeSchema);

export default Cafe;