import express from "express";
import { loginUser, addUser, getUsers } from "../controllers/noteController.js";

const authRouter = express.Router();

// Routes for authentication
authRouter.post('/login', loginUser);
authRouter.post('/signup', addUser);
authRouter.get('/users', getUsers);

export default authRouter;
