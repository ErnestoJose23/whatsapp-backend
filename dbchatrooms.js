const mongoose = require("mongoose");

const whatsappSchema = mongoose.Schema({
  idChat: String,
  user: String,
  timestamp: String,
});

module.exports = mongoose.model("chatroom", whatsappSchema);
