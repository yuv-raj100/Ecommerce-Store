const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    data: String
})

module.exports = mongoose.model("homepage",userSchema);