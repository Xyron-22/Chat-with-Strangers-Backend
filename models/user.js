const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config()

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    chatId: [String],
    createdAt: {
        type: Date,
        default: new Date(Date.now())
    }
});


const userModel = mongoose.model(process.env.USER, userSchema);
module.exports = userModel;