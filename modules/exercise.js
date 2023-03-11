const mongoose = require('mongoose')

 

const excerciseSchema = new mongoose.Schema(
  {
    userID: {type : 'string',required: true},
    description: {type : 'string',required: true},
    duration: {type : 'number',required: true},
    date: {type : 'date',required: true}
  }
);
  
let Excercise = mongoose.model("Excercise", excerciseSchema);

module.exports = Excercise




