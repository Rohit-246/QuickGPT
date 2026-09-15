import express from "express"
import { protect } from "../middlewares/auth.js"
import { imaggeMessageController, textMessageController } from "../controllers/messageController.js"


const messageRouter = express.Router()

messageRouter.post('/text', protect, textMessageController)
messageRouter.post('/image', protect, imaggeMessageController)


export default messageRouter;
