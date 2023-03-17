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
}).then(res => console.log("Connected to DB"))

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
  const duration = parseInt(  req.body.duration);
  const date = req.body.date ? new Date(req.body.date).toDateString() : new Date().toDateString();
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
          description: description,
          duration: duration,
          date: date,
          _id: _id,
        });
      });
  });
});



app.get("/api/users/:id/logs",(req, res) => {
  const id = req.params.id
  const filterFrom = req.query.from ? new Date(req.query.from) : null
  const filterTo = req.query.to ? new Date(req.query.to)  : null
  const filterLimit =  req.query.limit

  console.log(filterFrom,filterTo,filterLimit)
  User.findById(id).select({ username: 1}).then((userRes) => {
    const username = userRes.username
    getExercises(id,filterFrom,filterTo,filterLimit).then((results) => {
      res.json({
        _id:id,
        username: username,
        count: [...results].length,
        log : results
      }
      )
    }
    )
  })

})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});


async function getExercises(userID, dateA = null, dateB = null, limit = null) {
  try {
    const query = {
      userID: userID
    };
    
    if (dateA && dateB) {
      query.date = { $gte: dateA, $lte: dateB };
    } else if (dateA) {
      query.date = { $gte: dateA };
    } else if (dateB) {
      query.date = { $lte: dateB };
    }

    const exercisesQuery = Excercise.find(query).select({_id:0,__v:0,userID:0});
    if (limit) {
      exercisesQuery.limit(limit);
    }

    const exercises = await exercisesQuery.exec();
    return exercises;
  } catch (err) {
    console.error(err);
    throw err;
  }
}