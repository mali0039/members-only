const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { SchemaTypes } = require("mongoose")


const Post = mongoose.model('Post', new Schema({
    timestamp: {type: Date, default: Date.now, required: true},
    text: {type: String, required: true},
    createdBy: {type: SchemaTypes.ObjectId, required: true, ref: "User"}
}))

module.exports = Post