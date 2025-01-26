import express from "express";
import { getNotes, addNote, deleteNote, editNote } from "../controllers/noteController.js";
import { validateToken } from "../middleware/exampleMiddleware.js";

const notesRouter = express.Router();

// Routes for notes management
notesRouter.get('/notes/:user', validateToken, getNotes);
notesRouter.post('/note/:user', validateToken, addNote);
notesRouter.delete('/note/:user', validateToken, deleteNote);
notesRouter.put('/note/:user', validateToken, editNote);

export default notesRouter;
