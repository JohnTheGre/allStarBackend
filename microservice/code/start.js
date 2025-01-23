// start.js setup
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors'; // Import CORS middleware

dotenv.config({ path: 'variables.env' });

import authRouter from '../../microservice/code/routes/auth.js'; // Authentication routes
import notesRouter from '../../microservice/code/routes/notes.js'; // Notes routes

const app = express();

// Enable CORS for all routes
app.use(cors());

// Support JSON encoded and URL-encoded bodies, mainly used for POST and update
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount authentication routes at /auth
app.use('/auth', authRouter);

// Mount notes routes at /api
app.use('/api', notesRouter);

app.set('port', process.env.PORT || 3019);
const server = app.listen(app.get('port'), () => {
  console.log(`🍿 Express running → PORT ${server.address().port}`);
});
