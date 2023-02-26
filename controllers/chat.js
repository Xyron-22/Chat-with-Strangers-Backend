const userModel = require("../models/user.js");
const chatModel = require("../models/chatId.js");



const createChat = async (req, res) => {
    const {getUserId, getOtherUserId} = req.body;
    const existingUser = await userModel.findOne({_id: getUserId})
    const existingOtherUser = await userModel.findOne({_id: getOtherUserId})
       
    const result = existingUser?.chatId.find((value) => existingOtherUser?.chatId.includes(value))
    if(result) {
        return res.status(200).json(result);
    } else if (existingUser && existingOtherUser) {
        let chatArr;
        let chatArr1;
        const createNewChat = new chatModel();
            try {
               await createNewChat.save()
               existingUser?.chatId.push(createNewChat._id)
               chatArr = existingUser?.chatId
               existingOtherUser?.chatId.push(createNewChat._id)
               chatArr1 = existingOtherUser?.chatId
               await userModel.findByIdAndUpdate(getUserId, {chatId: chatArr}, {new: true})
               await userModel.findByIdAndUpdate(getOtherUserId, {chatId: chatArr1}, {new: true})
               return res.status(200).json(createNewChat._id)
               
            } catch (error) {
                console.log(error)
            }
    } else {
        return res.status(400)
    }
    
}


const getChats = async (req, res) => {
    const {id} = req.params;
    try {
        if (id) {
            const chatArr = await chatModel.findOne({_id: id})
            return res.status(200).json(chatArr.chats)
        }
        return res.status(400)
    } catch (error) {
        console.log(error)
    }
       
}



module.exports = {createChat , getChats}