const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { SchemaTypes } = require("mongoose")


const Post = mongoose.model('Post', new Schema({
    title: {type: String, required: true},
    timestamp: {type: Date, default: Date.now, required: true},
    text: {type: String, required: true},
    createdBy: {type: SchemaTypes.ObjectId, required: true}
}))

module.exports = Post