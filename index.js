const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.set('view engine', 'ejs');

// TODO: Johnny add index.ejs and make a pretty landing page for Cohort 132
app.get('/', (req, res) => {
  res.send('Hello World!');
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

// TODO: Nithin add 404 handler. This will handle 404 not found requests.

app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
