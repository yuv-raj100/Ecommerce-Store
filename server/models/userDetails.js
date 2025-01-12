const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
});

module.exports = mongoose.model("UserDetails",userSchema);