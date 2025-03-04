import mongoose from "mongoose";

const job = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    salary: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    skills: {
        type: Array,
        required: true,
    },
    remote: {
        type: Boolean,
        required: true,
    },
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
        // The `enum` option specifies a set of allowed values for this field. 
        // It ensures that the value of the `type` field can only be one of the specified values. 
        // If a value outside of this set is provided, Mongoose will throw a validation error. 
        // This is useful for defining a fixed set of possible values for a field, such as job types in this case.
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

export default mongoose.model('Job', job);