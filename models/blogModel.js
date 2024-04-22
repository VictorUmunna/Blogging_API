const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BlogSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    author: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      default: "draft",
      enum: ["draft", "published"],
    },
    read_count: {
      type: Number,
      default: 0,
    },
    reading_time: {
      type: String,
    },
    tags: [String],

    body: {
      type: String,
    },
  },
  { timestamps: true }
);

BlogModel = mongoose.model("blogs", BlogSchema);

module.exports = BlogModel;