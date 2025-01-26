const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required:true,
  },
  password: {
    type: String,
    required:true,
  },
  email: {
    type: String,
    unique: true,
    required:true,
  },
});

module.exports = mongoose.model("UserDetails",userSchema);