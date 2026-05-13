const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// TODO: Onkar add /about. This displays app information such as name, port, and description.

// TODO: Megan add /teams route. This will display all team member names.

// TODO: Nithing add 404 handler. This will handle 404 not found requests.




app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
