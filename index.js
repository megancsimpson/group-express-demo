const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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

// TODO: Nithin add 404 handler. This will handle 404 not found requests.
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
