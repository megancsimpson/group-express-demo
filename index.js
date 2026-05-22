// DNS fix for Windows 11 + Node v24 bug.
const dns = require("dns");
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require("mongoose");
const User = require("./models/userSchema");

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
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
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const googleId = profile?.id;
    if (!googleId) return done(new Error("Google profile missing id"));

    const displayName = profile?.displayName || "Unknown";
    const email = profile?.emails?.[0]?.value;
    const photo = profile?.photos?.[0]?.value;

    const user = await User.findOneAndUpdate(
      { googleId },
      { googleId, displayName, email, photo, lastLoginAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//connnect to mongoose
mongoose.connect(process.env.mongo_connection_string)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// TODO: Johnny add index.ejs and make a pretty landing page for Cohort 132
app.get('/', (req, res) => {
  res.render('index', { user: req.user || null });
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

// Add the Auth routes
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('/dashboard')
);

app.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});
// Pass the user to your views
app.get('/dashboard', (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  res.render('dashboard', { user: req.user || null });
});

// TODO: Nithin add 404 handler. This will handle 404 not found requests.
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
