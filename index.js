const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.set('view engine', 'ejs');
const PORT = 3000;

require('dotenv').config();
const mongoose = require("mongoose");

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//connnect to mongoose
mongoose.connect(process.env.mongo_connection_string)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// TODO: Johnny add index.ejs and make a pretty landing page for Cohort 132
app.get('/', (req, res) => {
    res.render('index');
});

// TODO: Onkar add /about. This displays app information such as name, port, and description.
app.get('/about', (req, res) => {
  res.render('about', {
    name: 'Group Express Demo',
    port: PORT,
    description: 'A collaborative Express app'
  });
});


// TODO: Megan add /teams route. This will display all team member names.
app.get('/teams', (req, res) => {
  const readmePath = path.join(__dirname, 'README.md');

  fs.readFile(readmePath, 'utf8', (readmeErr, readmeText) => {
    if (readmeErr) return res.status(500).send('Unable to load team list.');

    const teamMembers = readmeText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));

    res.render('teams', { teamMembers });
  });
});

// Prompts page: a simple place for devs to keep/share chat prompts
app.get('/prompts', (req, res) => {
  res.render('prompts');
});

// ── Notes CRUD ──────────────────────────────────────────────────────────────
let notes = [];
let nextId = 1;

// READ – list all notes
app.get('/notes', (req, res) => {
  res.render('notes', { notes });
});

// CREATE – add a new note
app.post('/notes', (req, res) => {
  const { title, content } = req.body;
  notes.push({ id: nextId++, title, content });
  res.redirect('/notes');
});

// UPDATE – replace a note's title and content
app.put('/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const note = notes.find(n => n.id === id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  note.title = req.body.title ?? note.title;
  note.content = req.body.content ?? note.content;
  res.json(note);
});

// DELETE – remove a note
app.delete('/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = notes.findIndex(n => n.id === id);
  if (index === -1) return res.status(404).json({ error: 'Note not found' });
  notes.splice(index, 1);
  res.json({ message: 'Note deleted' });
});
// ────────────────────────────────────────────────────────────────────────────

// TODO: Nithin add 404 handler. This will handle 404 not found requests.
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
