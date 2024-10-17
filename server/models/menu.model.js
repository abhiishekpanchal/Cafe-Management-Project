import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    cafeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Cafe',
    },
    dishName: {
        type: String,
        required: true,
    },
    dishDescription: {
        type: String,
        required: true,
    },
    dishPrice: {
        type: Number,
        required: true,
    },
    dishCategory: {
        type: String,
        required: true,
    },
    dishType: {
        type: String,
        required: true,
        enum: ['VEG', 'NON-VEG'],
    },
    dishStatus: {
        type: Boolean,
        require: true,
        default: true,
    }
}, {timestamps: true});

const Menu = mongoose.model('Menu', menuSchema);

export default Menu;