const mongoose = require("mongoose");

const excerciseSchema = new mongoose.Schema({
  userID: { type: "string", required: true },
  description: { type: "string", required: true },
  duration: { type: "number", required: true },
  date: { type: "date", required: true,get:getDate},
  id: { type: "string"}
},{ toJSON: { getters: true } });

let Excercise = mongoose.model("Excercise", excerciseSchema);

function getDate(date) {
  return new Date(date).toDateString();
}

module.exports = Excercise;
