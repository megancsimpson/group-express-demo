require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require("mongoose");

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.set('view engine', 'ejs');
const PORT = 3000;

// Add session and passport middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Configure the Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

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

// TODO: Nithin add 404 handler. This will handle 404 not found requests.
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

// Add the Auth routes
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('/')
);

app.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});
// Pass the user to your views
app.get('/', (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.render('index', {
    user: req.user
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
