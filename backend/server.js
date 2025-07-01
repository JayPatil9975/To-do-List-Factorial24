import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
const PORT = 8080;
const MONGO_URI = 'mongodb+srv://anermarbatr:LKnP5P88rxC0Oxfg@cluster0.sjdo0vw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = 'your_jwt_secret'; // Change this to a strong secret in production

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});
const Task = mongoose.model('Task', taskSchema);

// Auth middleware
function auth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Register
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'All fields required' });
  const existing = await User.findOne({ $or: [{ username }, { email }] });
  if (existing) return res.status(409).json({ error: 'Username or email already exists' });
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashed });
  await user.save();
  res.status(201).json({ message: 'User registered' });
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


// All task routes below require authentication
app.use('/api/tasks', auth);

// Get all tasks for the logged-in user
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

// Add a new task for the logged-in user
app.post('/api/tasks', async (req, res) => {
  const { text } = req.body;
  const newTask = new Task({ text, userId: req.user.id });
  await newTask.save();
  res.status(201).json(newTask);
});

// Edit/update a task (only if it belongs to the user)
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const updated = await Task.findOneAndUpdate(
    { _id: id, userId: req.user.id },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: 'Task not found' });
  res.json(updated);
});

// Delete a task (only if it belongs to the user)
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const deleted = await Task.findOneAndDelete({ _id: id, userId: req.user.id });
  if (!deleted) return res.status(404).json({ error: 'Task not found' });
  res.status(204).end();
});

// Get current user info
app.get('/api/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
