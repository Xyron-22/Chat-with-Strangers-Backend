const userModel = require("../models/user.js");
const chatModel = require ("../models/chatId.js");


const signUp = async (req, res) => {
    const {username, password} = req.body;
    if (await userModel.findOne({username, password})) {
        return res.json("User already exist")
    }
    const create =  new userModel({
        username,
        password
    })
    try {
        await create.save();
        res.status(200).json({id: create._id, chatId: create.chatId, username: create.username})
    } catch (error) {
        console.log(error)
    }
         
}
const signIn = async (req, res) => {
    const {username, password} = req.body;
    console.log(!await userModel.findOne({username, password}))
    if (!await userModel.findOne({username, password})) {
        return res.json("User does not exist")
    }
    const user = await userModel.findOne({username, password})
    try {
        res.status(200).json({id: user._id, chatId: user.chatId, username: user.username})
        console.log("signin reached")
    } catch (error) {
        console.log(error)
    }
}
const getUsers =  async (req, res) => {
    const users = await userModel.find()
    try {
        res.status(200).json(users)
    } catch (error) {
        console.log(error)
    }
}


module.exports = {signUp, signIn, getUsers}