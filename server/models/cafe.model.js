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
    categories: {
        type: Array,
        required: true,
        default: [],
    }
}, {timestamps: true});

const Cafe = mongoose.model('Cafe', cafeSchema);

export default Cafe;