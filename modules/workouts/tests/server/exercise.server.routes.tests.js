'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Exercise = mongoose.model('Exercise'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, exercise;

/**
 * Exercise routes tests
 */
describe('Exercise CRUD tests', function () {
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

    // Save a user to the test db and create new exercise
    user.save(function () {
      exercise = {
        name: 'Exercise Name',
        description: 'Exercise Description',
        repetitions: 10,
        sets: 10
      };

      done();
    });
  });

  it('should be able to save an exercise if logged in', function (done) {
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

        // Save a new exercise
        agent.post('/api/exercises')
          .send(exercise)
          .expect(200)
          .end(function (exerciseSaveErr, exerciseSaveRes) {
            // Handle exercise save error
            if (exerciseSaveErr) {
              return done(exerciseSaveErr);
            }

            // Get a list of exercises
            agent.get('/api/exercises')
              .end(function (exercisesGetErr, exercisesGetRes) {
                // Handle exercise save error
                if (exercisesGetErr) {
                  return done(exercisesGetErr);
                }

                // Get exercises list
                var exercises = exercisesGetRes.body;

                // Set assertions
                (exercises[0].user._id).should.equal(userId);
                (exercises[0].name).should.match('Exercise Name');
                (exercises[0].description).should.match('Exercise Description');
                (exercises[0].repetitions).should.match(10);
                (exercises[0].sets).should.match(10);


                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an exercise if not logged in', function (done) {
    agent.post('/api/exercises')
      .send(exercise)
      .expect(403)
      .end(function (exerciseSaveErr, exerciseSaveRes) {
        // Call the assertion callback
        done(exerciseSaveErr);
      });
  });

  it('should not be able to save an exercise if no name is provided', function (done) {
    // Invalidate name field
    exercise.name = '';

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

        // Save a new exercise
        agent.post('/api/exercises')
          .send(exercise)
          .expect(400)
          .end(function (exerciseSaveErr, exerciseSaveRes) {
            // Set message assertion
            (exerciseSaveRes.body.message).should.match('Name cannot be blank');

            // Handle exercise save error
            done(exerciseSaveErr);
          });
      });
  });

  it('should be able to update an exercise if signed in', function (done) {
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

        // Save a new exercise
        agent.post('/api/exercises')
          .send(exercise)
          .expect(200)
          .end(function (exerciseSaveErr, exerciseSaveRes) {
            // Handle exercise save error
            if (exerciseSaveErr) {
              return done(exerciseSaveErr);
            }

            // Update exercise name
            exercise.name = 'WHY YOU GOTTA BE SO MEAN?';
            exercise.description = 'COOL NEW DESC';
            exercise.repetitions = 15;
            exercise.sets = 15;

            // Update an existing exercise
            agent.put('/api/exercises/' + exerciseSaveRes.body._id)
              .send(exercise)
              .expect(200)
              .end(function (exerciseUpdateErr, exerciseUpdateRes) {
                // Handle exercise update error
                if (exerciseUpdateErr) {
                  return done(exerciseUpdateErr);
                }

                // Set assertions
                (exerciseUpdateRes.body._id).should.equal(exerciseSaveRes.body._id);
                (exerciseUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
                (exerciseUpdateRes.body.description).should.match('COOL NEW DESC');
                (exerciseUpdateRes.body.repetitions).should.match(15);
                (exerciseUpdateRes.body.sets).should.match(15);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of exercises if not signed in', function (done) {
    // Create new exercise model instance
    var exerciseObj = new Exercise(exercise);

    // Save the exercise
    exerciseObj.save(function () {
      // Request exercises
      request(app).get('/api/exercises')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });


  it('should be able to get a single exercise if not signed in', function (done) {
    // Create new exercise model instance
    var exerciseObj = new Exercise(exercise);

    // Save the exercise
    exerciseObj.save(function () {
      request(app).get('/api/exercises/' + exerciseObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', exercise.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single exercise which doesnt exist, if not signed in', function (done) {
    request(app).get('/api/exercises/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Exercise is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an exercise if signed in', function (done) {
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

        // Save a new exercise
        agent.post('/api/exercises')
          .send(exercise)
          .expect(200)
          .end(function (exerciseSaveErr, exerciseSaveRes) {
            // Handle exercise save error
            if (exerciseSaveErr) {
              return done(exerciseSaveErr);
            }

            // Delete an existing exercise
            agent.delete('/api/exercises/' + exerciseSaveRes.body._id)
              .send(exercise)
              .expect(200)
              .end(function (exerciseDeleteErr, exerciseDeleteRes) {
                // Handle exercise error error
                if (exerciseDeleteErr) {
                  return done(exerciseDeleteErr);
                }

                // Set assertions
                (exerciseDeleteRes.body._id).should.equal(exerciseSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an exercise if not signed in', function (done) {
    // Set exercise user
    exercise.user = user;

    // Create new exercise model instance
    var exerciseObj = new Exercise(exercise);

    // Save the exercise
    exerciseObj.save(function () {
      // Try deleting exercise
      request(app).delete('/api/exercises/' + exerciseObj._id)
        .expect(403)
        .end(function (exerciseDeleteErr, exerciseDeleteRes) {
          // Set message assertion
          (exerciseDeleteRes.body.message).should.match('User is not authorized');

          // Handle exercise error error
          done(exerciseDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Exercise.remove().exec(done);
    });
  });
});
