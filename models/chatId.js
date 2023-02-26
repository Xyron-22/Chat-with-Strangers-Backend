const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config()

const chatSchema = mongoose.Schema({
    chats: [Object],
    createdAt: {
        type: Date,
        default: new Date(Date.now())
    }
});

const chatModel = mongoose.model(process.env.CHAT, chatSchema);

module.exports = chatModel;