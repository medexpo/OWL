const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  dpurl: String,
  googleId: String,
  score: Number,
  level: Number,
  elapsedTime: Number,
  assignedQSet: JSON
});

const User = mongoose.model("user", userSchema);

module.exports = User;
