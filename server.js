const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 9000;

const connection_url =
  "mongodb+srv://admin:fUi8PFzCUgWMRCp@cluster0.3ni6y.mongodb.net/whatsappdb?retryWrites=true&w=majority";

mongoose.connect(connection_url, {
  userCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => res.status(200).send("hello wrld"));

app.listen(port, () => console.log(`Listening on localhost:${port}`));
