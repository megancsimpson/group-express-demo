const mongoose = require("mongoose");

// DATA VALIDATION
const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true, index: true },
  displayName: { type: String, required: true },
  email: { type: String },
  photo: { type: String },
  lastLoginAt: { type: Date, default: Date.now }
}, { timestamps: true });

// export your schema so it applies to the User entries
module.exports = mongoose.model("User", userSchema)
// User.find() to find something later
// whatever our schema name is, it will be used for all Query commands later
