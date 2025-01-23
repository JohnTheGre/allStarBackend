import express from "express";
import { getNotes, addNote } from "../controllers/noteController.js";
import { validateToken } from "../middleware/exampleMiddleware.js";

const notesRouter = express.Router();

// Routes for notes management
notesRouter.get('/notes/:user', validateToken, getNotes);
notesRouter.post('/note/:user', validateToken, addNote);

export default notesRouter;
