import { hash, compare } from 'bcrypt';
import pkg from 'jsonwebtoken';
const { sign } = pkg;
import fs from 'fs';
import path from 'path';
const dbPath = path.resolve('./db.json');

const readDatabase = () => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
};

const writeDatabase = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
};

export async function addUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const db = readDatabase();
    const userExists = db.users.some((user) => user.user === name);

    if (userExists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = {
      user: name,
      email,
      password: hashedPassword,
      notes: [],
    };

    db.users.push(newUser);
    writeDatabase(db);

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getUsers(req, res) {
  try {
    const db = readDatabase();
    res.status(200).json({ users: db.users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function loginUser(req, res) {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: 'Name and password are required' });
    }

    const db = readDatabase();
    const user = db.users.find((u) => u.user === name);

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const accessToken = generateAccessToken({ user: user.user });

    res.json({ accessToken, username: user.user, message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

function generateAccessToken(user) {
  return sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

export async function addNote(req, res) {
  try {
    const { user, note } = req.body;

    if (!user || !note) {
      return res.status(400).json({ message: 'User and note are required' });
    }

    const db = readDatabase();
    const foundUser = db.users.find((u) => u.user === user);

    if (!foundUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const timestamp = new Date().toISOString(); // Current time in ISO format
    foundUser.notes.push({ note, timestamp }); // Add the note with the timestamp
    writeDatabase(db);

    res.status(201).json({ message: 'Note added successfully', note });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getNotes(req, res) {
  try {
    const { user } = req.params;

    if (!user) {
      return res.status(400).json({ message: 'User is required' });
    }

    const db = readDatabase();
    const foundUser = db.users.find((u) => u.user === user);

    if (!foundUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ notes: foundUser.notes }); // Include the timestamp with the notes
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function deleteNote(req, res) {
  try {
    const { user, note } = req.body;

    if (!user || !note) {
      return res.status(400).json({ message: "User and note are required" });
    }

    const db = readDatabase();
    const foundUser = db.users.find((u) => u.user === user);

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const noteIndex = foundUser.notes.findIndex((n) => n.note === note);
    if (noteIndex === -1) {
      return res.status(404).json({ message: "Note not found" });
    }

    foundUser.notes.splice(noteIndex, 1); // Remove the note
    writeDatabase(db);

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function editNote(req, res) {
  try {
    const { user, oldNote, newNote } = req.body;

    if (!user || !oldNote || !newNote) {
      return res.status(400).json({ message: "User, old note, and new note are required" });
    }

    const db = readDatabase();
    const foundUser = db.users.find((u) => u.user === user);

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const noteIndex = foundUser.notes.findIndex((n) => n.note === oldNote);
    if (noteIndex === -1) {
      return res.status(404).json({ message: "Old note not found" });
    }

    foundUser.notes[noteIndex].note = newNote; // Update the note
    writeDatabase(db);

    res.status(200).json({ message: "Note updated successfully", note: newNote });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
