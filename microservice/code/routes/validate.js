import express from 'express';
import { validateToken } from '../middleware/middleware.js';
import { responseExample } from '../controllers/controller.js';
const router = express.Router();

router.get("/posts", validateToken, responseExample);

export default router;

