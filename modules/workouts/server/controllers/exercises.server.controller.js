'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Exercise = mongoose.model('Exercise'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a exercise
 */
exports.create = function(req, res) {
  var exercise = new Exercise(req.body);
  exercise.user = req.user;

  exercise.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(exercise);
    }
  });
};

/**
 * Show the current exercise
 */
exports.read = function(req, res) {
  res.json(req.exercise);
};

/**
 * Update a exercise
 */
exports.update = function(req, res) {
  var exercise = req.exercise;

  exercise.name = req.body.name;
  exercise.description = req.body.description;
  exercise.repetitions = req.body.repetitions;
  exercise.sets = req.body.repetitions;

  exercise.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(exercise);
    }
  });
};

/**
 * Delete an exercise
 */
exports.delete = function(req, res) {
  var exercise = req.exercise;

  exercise.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(exercise);
    }
  });
};

/**
 * List of Exercises
 */
exports.list = function(req, res) {
  Exercise.find().sort('-created').populate('user', 'displayName').exec(function(err, exercises) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(exercises);
    }
  });
};

/**
 * Exercise middleware
 */
exports.exerciseByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Exercise is invalid'
    });
  }

  Exercise.findById(id).populate('user', 'displayName').exec(function(err, exercise) {
    if (err) return next(err);
    if (!exercise) {
      return res.status(404).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    req.exercise = exercise;
    next();
  });
};
