const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    state: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    read_count: {
        type: Number,
        default: 0
    },
    reading_time: {
        type: Number,
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    body: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now

    }
})


const BlogModel = mongoose.model("blogs", BlogSchema);

module.exports = BlogModel;