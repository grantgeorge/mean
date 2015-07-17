'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Workout = mongoose.model('Workout'),
  _ = require('lodash'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Exercise = mongoose.model('Exercise');

/**
 * Create a workout
 */
exports.create = function(req, res) {
  var workout = new Workout(req.body);
  workout.user = req.user;

  workout.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(workout);
    }
  });
};

/**
 * Show the current workout
 */
exports.read = function(req, res) {
  res.json(req.workout);
};

/**
 * Update a workout
 */
exports.update = function(req, res) {
  var workout = req.workout;

  workout.name = req.body.name;
  workout.description = req.body.description;

  workout.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      _.forEach(workout.exercises, function(id) {

        Exercise.findOne({_id: id}).exec(function(err, exercise) {
          console.log(exercise);
          workout.exercises.push(exercise);
          exercise.save(function (err, t) {
            if (err) res.send(err, 500);
          });
        });
      });

      res.json(workout);
    }
  });
};

/**
 * Delete an workout
 */
exports.delete = function(req, res) {
  var workout = req.workout;

  workout.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(workout);
    }
  });
};

/**
 * List of Workouts
 */
exports.list = function(req, res) {
  Workout.find().sort('-created').populate('user', 'displayName').exec(function(err, workouts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(workouts);
    }
  });
};

/**
 * Workout middleware
 */
exports.workoutByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Workout is invalid'
    });
  }

  Workout.findById(id).populate('user', 'displayName').exec(function(err, workout) {
    if (err) return next(err);
    if (!workout) {
      return res.status(404).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    req.workout = workout;
    next();
  });
};
