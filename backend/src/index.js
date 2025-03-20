import express from 'express'
import ConnectDB from './DB/ConnectDB.js'
import UserSignUpRoute from './Routes/UserSignUp.js'
import UsersRoute from './Routes/Users.js'
import MessageRoute from './Routes/Message.js'
import FriendsRoute from './Routes/Friends.js'
import cors from 'cors'
import GroupsRoute from './Routes/Groups.js'
import EmailSendRoute from './Routes/EmailSend.js'
import cookieParser from 'cookie-parser'
import {app,server} from './lib/Socket.js'
import dotenv from 'dotenv'
import path from 'path'


dotenv.config();

const __dirname = path.resolve();
const FURL = process.env.FURL
const PORT = process.env.PORT || 5001

app.use(express.json());
app.use(cookieParser())

app.use(cors({
    origin: FURL,
    credentials: true,
  }))

app.use('/api/sign-up',UserSignUpRoute)
app.use('/api/users',UsersRoute)
app.use('/api/user/message',MessageRoute)
app.use('/api/addfriends',FriendsRoute)
app.use('/api/groups',GroupsRoute)
app.use('/api/email',EmailSendRoute)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}


server.listen(PORT,()=>{
    console.log(`App is running on PORT ${PORT}`);
    ConnectDB()
});