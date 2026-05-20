const mongoose = require("mongoose");

// DATA VALIDATION
const userSchema = new mongoose.Schema({
    name: { type: String , required: true},
    task: { type: String , required: true},
});

// export your schema so it applies to the User entries
module.exports = mongoose.model("User", userSchema)
// User.find() to find something later
// whatever our schema name is, it will be used for all Query commands later