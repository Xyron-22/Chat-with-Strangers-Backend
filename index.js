const mongoose = require("mongoose");
const express = require("express");
const app = express();
const {createServer} = require("http");
const { Server } = require("socket.io");
const {signUp, signIn, getUsers} = require("./controllers/user.js");
const {createChat, getChats} = require("./controllers/chat.js");
const chatModel = require("./models/chatId.js");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const {FRONT_END_BASE_URL, DATA_BASE_CONNECTION, PORT} = process.env;

app.use(cors());
app.use(express.urlencoded({extended: true}))
app.use(express.json())

mongoose.set("strictQuery", true)
mongoose.connect(DATA_BASE_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => console.log("Conneted to the database"))

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: FRONT_END_BASE_URL,
        methods: ["GET", "POST"],
}
});


app.post("/signup", signUp);
app.post("/signin", signIn);

app.get("/", getUsers);
app.post("/getChats/:id", getChats);
app.post("/createChat", createChat);


io.on("connection", (socket) => {
    
    socket.on("send_message", (data) => {
        const sendData =  async () => {
            const {room, author, message, time} = data;
            const chatFound = await chatModel.findOne({_id: room})
            
            try {
                let chatArr;
                
            if (chatFound) {
                chatFound.chats.push({author, message, time})
                chatArr = chatFound.chats;
                await chatModel.findOneAndUpdate({_id: room}, {chats: chatArr}, {new: true})
                socket.to(room).emit("receive_message", chatArr)
            } 
            } catch (error) {
                console.log(error)
            }
        }
        sendData();
    })
    socket.on("join_room" , (data) => {
        if (data) {
            socket.join(data)
        }
    })

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id)
    })
});

httpServer.listen(PORT, () => console.log(`Connected to port: ${PORT}`));
