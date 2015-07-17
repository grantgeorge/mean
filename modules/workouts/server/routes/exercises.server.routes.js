'use strict';

/**
 * Module dependencies.
 */
var exercisesPolicy = require('../policies/exercises.server.policy'),
  exercises = require('../controllers/exercises.server.controller');

module.exports = function(app) {
  // Exercises collection routes
  app.route('/api/exercises').all(exercisesPolicy.isAllowed)
    .get(exercises.list)
    .post(exercises.create);

  // Single exercise routes
  app.route('/api/exercises/:exerciseId').all(exercisesPolicy.isAllowed)
    .get(exercises.read)
    .put(exercises.update)
    .delete(exercises.delete);

  // Finish by binding the exercise middleware
  app.param('exerciseId', exercises.exerciseByID);
};
