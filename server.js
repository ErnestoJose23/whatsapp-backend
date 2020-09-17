const express = require("express");
const mongoose = require("mongoose");
const Pusher = require("pusher");
const cors = require("cors");

const Messages = require("./dbmessages.js");
const Chatrooms = require("./dbchatrooms.js");

const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
  appId: "1073931",
  key: "818f4bae4e80379dd079",
  secret: "dfe575951652f6a60527",
  cluster: "eu",
  encrypted: true,
});

app.use(express.json());
app.use(cors());

const connection_url =
  "mongodb+srv://admin:fUi8PFzCUgWMRCp@cluster0.3ni6y.mongodb.net/whatsappdb?retryWrites=true&w=majority";

mongoose.connect(connection_url, {
  userCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", () => {
  console.log("db connected");

  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    console.log(change);
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
        chatroom: messageDetails.chatroom,
      });
    } else {
      console.log("Error triggering Pusher");
    }
  });
});

app.get("/", (req, res) => res.status(200).send("hello wrld"));

app.get(`/messages/sync`, (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.get(`/chatrooms/sync`, (req, res) => {
  Chatrooms.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/chatrooms/new", (req, res) => {
  const dbMessage = req.body;

  Chatrooms.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get(`/messages/:chatroom`, (req, res) => {
  const chatroom = req.params.chatroom;
  Messages.find({ chatroom: chatroom }, function (err, data) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.listen(port, () => console.log(`Listening on localhost:${port}`));
