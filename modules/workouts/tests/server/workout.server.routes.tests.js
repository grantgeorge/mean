'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Workout = mongoose.model('Workout'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, workout;

/**
 * Workout routes tests
 */
describe('Workout CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'password'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new workout
    user.save(function () {
      workout = {
        name: 'Workout Name',
        description: 'Workout Description'
      };

      done();
    });
  });

  it('should be able to save an workout if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new workout
        agent.post('/api/workouts')
          .send(workout)
          .expect(200)
          .end(function (workoutSaveErr, workoutSaveRes) {
            // Handle workout save error
            if (workoutSaveErr) {
              return done(workoutSaveErr);
            }

            // Get a list of workouts
            agent.get('/api/workouts')
              .end(function (workoutsGetErr, workoutsGetRes) {
                // Handle workout save error
                if (workoutsGetErr) {
                  return done(workoutsGetErr);
                }

                // Get workouts list
                var workouts = workoutsGetRes.body;

                // Set assertions
                (workouts[0].user._id).should.equal(userId);
                (workouts[0].name).should.match('Workout Name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an workout if not logged in', function (done) {
    agent.post('/api/workouts')
      .send(workout)
      .expect(403)
      .end(function (workoutSaveErr, workoutSaveRes) {
        // Call the assertion callback
        done(workoutSaveErr);
      });
  });

  it('should not be able to save an workout if no name is provided', function (done) {
    // Invalidate name field
    workout.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new workout
        agent.post('/api/workouts')
          .send(workout)
          .expect(400)
          .end(function (workoutSaveErr, workoutSaveRes) {
            // Set message assertion
            (workoutSaveRes.body.message).should.match('Name cannot be blank');

            // Handle workout save error
            done(workoutSaveErr);
          });
      });
  });

  it('should be able to update an workout if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new workout
        agent.post('/api/workouts')
          .send(workout)
          .expect(200)
          .end(function (workoutSaveErr, workoutSaveRes) {
            // Handle workout save error
            if (workoutSaveErr) {
              return done(workoutSaveErr);
            }

            // Update workout name
            workout.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing workout
            agent.put('/api/workouts/' + workoutSaveRes.body._id)
              .send(workout)
              .expect(200)
              .end(function (workoutUpdateErr, workoutUpdateRes) {
                // Handle workout update error
                if (workoutUpdateErr) {
                  return done(workoutUpdateErr);
                }

                // Set assertions
                (workoutUpdateRes.body._id).should.equal(workoutSaveRes.body._id);
                (workoutUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of workouts if not signed in', function (done) {
    // Create new workout model instance
    var workoutObj = new Workout(workout);

    // Save the workout
    workoutObj.save(function () {
      // Request workouts
      request(app).get('/api/workouts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });


  it('should be able to get a single workout if not signed in', function (done) {
    // Create new workout model instance
    var workoutObj = new Workout(workout);

    // Save the workout
    workoutObj.save(function () {
      request(app).get('/api/workouts/' + workoutObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', workout.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single workout which doesnt exist, if not signed in', function (done) {
    request(app).get('/api/workouts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Workout is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an workout if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new workout
        agent.post('/api/workouts')
          .send(workout)
          .expect(200)
          .end(function (workoutSaveErr, workoutSaveRes) {
            // Handle workout save error
            if (workoutSaveErr) {
              return done(workoutSaveErr);
            }

            // Delete an existing workout
            agent.delete('/api/workouts/' + workoutSaveRes.body._id)
              .send(workout)
              .expect(200)
              .end(function (workoutDeleteErr, workoutDeleteRes) {
                // Handle workout error error
                if (workoutDeleteErr) {
                  return done(workoutDeleteErr);
                }

                // Set assertions
                (workoutDeleteRes.body._id).should.equal(workoutSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an workout if not signed in', function (done) {
    // Set workout user
    workout.user = user;

    // Create new workout model instance
    var workoutObj = new Workout(workout);

    // Save the workout
    workoutObj.save(function () {
      // Try deleting workout
      request(app).delete('/api/workouts/' + workoutObj._id)
        .expect(403)
        .end(function (workoutDeleteErr, workoutDeleteRes) {
          // Set message assertion
          (workoutDeleteRes.body.message).should.match('User is not authorized');

          // Handle workout error error
          done(workoutDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Workout.remove().exec(done);
    });
  });
});
