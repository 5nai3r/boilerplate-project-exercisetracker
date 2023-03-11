const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./modules/user");
const Excercise = require("./modules/exercise");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  const newUser = new User({ username: req.body.username });
  newUser.save().then((response) => {
    console.log(response);
    res.json({
      username: response.username,
      _id: response._id,
    });
  });
});
app.get("/api/users", (req, res) => {
  User.find()
    .select({ __v: 0 })
    .then((response) => {
      res.json(response);
    });
});

app.post("/api/users/:id/exercises", (req, res) => {
  const id = req.params.id;
  const description = req.body.description;
  const duration = req.body.duration;
  const date = new Date(req.body.date) || new Date();
  const newExo = new Excercise({
    userID: id,
    description: description,
    duration: duration,
    date: date,
  });

  newExo.save().then((response) => {
    User.findById(id)
      .select({ username: 1 })
      .then((userRes) => {
        username = userRes.username;
        _id = userRes._id;
        res.json({
          username: username,
          _id: _id,
          description: description,
          duration: duration,
          date: date.toDateString(),
        });
      });
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
