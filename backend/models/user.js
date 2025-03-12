import mongoose from "mongoose";

const user = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        sparse: true,
    },
    password: {
        type: String,
        required: true,
    },
    Phone: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})          

export default mongoose.model('User', user);