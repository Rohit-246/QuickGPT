import express from "express";
import { getPublishedImagess, getUser, loginUser, registerUser } from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";

const userRouter = express.Router();
  

userRouter.post('/register' , registerUser)
userRouter.post('/login' , loginUser)
userRouter.get('/data' ,protect, getUser)
userRouter.get('/published-images' ,getPublishedImagess)

export default userRouter;