const mongoose = require("mongoose");

module.exports = mongoose.model("User", new mongoose.Schema({
  name:String,
  email:String,
  password:String,
  isAdmin:{ type:Boolean, default:false }
}));
