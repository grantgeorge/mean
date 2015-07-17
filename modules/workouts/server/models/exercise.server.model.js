'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Exercise Schema
 */
var ExerciseSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Name cannot be blank'
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  repetitions: {
    type: Number,
    default: 0
  },
  sets: {
    type: Number,
    default: 0
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  workouts: [{
    type: Schema.ObjectId,
    ref: 'Workout'
  }]
});

mongoose.model('Exercise', ExerciseSchema);
