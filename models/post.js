const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    message: { type: String, required: true},
    postedAt: { type: Date, default: Date.now, required: true },
    user: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("Post", PostSchema);