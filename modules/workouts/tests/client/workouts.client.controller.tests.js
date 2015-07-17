 'use strict';

(function() {
  // Workouts Controller Spec
  describe('Workouts Controller Tests', function() {
    // Initialize global variables
    var WorkoutsController,
      scope,
      $httpBackend,
      $stateParams,
      $location;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function() {
      jasmine.addMatchers({
        toEqualData: function(util, customEqualityTesters) {
          return {
            compare: function(actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;

      // Initialize the Workouts controller.
      WorkoutsController = $controller('WorkoutsController', {
        $scope: scope
      });
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('$scope.find() should create an array with at least one workout object fetched from XHR', inject(function(Workouts) {
      // Create sample workout using the Workouts service
      var sampleWorkout = new Workouts({
        name: 'An Workout about MEAN',
        description: 'MEAN rocks!'
      });

      // Create a sample workouts array that includes the new workout
      var sampleWorkouts = [sampleWorkout];

      // Set GET response
      $httpBackend.expectGET('api/workouts').respond(sampleWorkouts);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.workouts).toEqualData(sampleWorkouts);
    }));

    it('$scope.findOne() should create an array with one workout object fetched from XHR using a workoutId URL parameter', inject(function(Workouts) {
      // Define a sample workout object
      var sampleWorkout = new Workouts({
        name: 'An Workout about MEAN',
        description: 'MEAN rocks!'
      });

      // Set the URL parameter
      $stateParams.workoutId = '525a8422f6d0f87f0e407a33';

      // Set GET response
      $httpBackend.expectGET(/api\/workouts\/([0-9a-fA-F]{24})$/).respond(sampleWorkout);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.workout).toEqualData(sampleWorkout);
    }));

    it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Workouts) {
      // Create a sample workout object
      var sampleWorkoutPostData = new Workouts({
        name: 'An Workout about MEAN',
        description: 'MEAN rocks!'
      });

      // Create a sample workout response
      var sampleWorkoutResponse = new Workouts({
        _id: '525cf20451979dea2c000001',
        name: 'An Workout about MEAN',
        description: 'MEAN rocks!'
      });

      // Fixture mock form input values
      scope.name = 'An Workout about MEAN';
      scope.description = 'MEAN rocks!';

      // Set POST response
      $httpBackend.expectPOST('api/workouts', sampleWorkoutPostData).respond(sampleWorkoutResponse);

      // Run controller functionality
      scope.create();
      $httpBackend.flush();

      // Test form inputs are reset
      expect(scope.name).toEqual('');
      expect(scope.description).toEqual('');

      // Test URL redirection after the workout was created
      expect($location.path()).toBe('/workouts/' + sampleWorkoutResponse._id);
    }));

    it('$scope.update() should update a valid workout', inject(function(Workouts) {
      // Define a sample workout put data
      var sampleWorkoutPutData = new Workouts({
        _id: '525cf20451979dea2c000001',
        name: 'An Workout about MEAN',
        description: 'MEAN Rocks!'
      });

      // Mock workout in scope
      scope.workout = sampleWorkoutPutData;

      // Set PUT response
      $httpBackend.expectPUT(/api\/workouts\/([0-9a-fA-F]{24})$/).respond();

      // Run controller functionality
      scope.update();
      $httpBackend.flush();

      // Test URL location to new object
      expect($location.path()).toBe('/workouts/' + sampleWorkoutPutData._id);
    }));

    it('$scope.remove() should send a DELETE request with a valid workoutId and remove the workout from the scope', inject(function(Workouts) {
      // Create new workout object
      var sampleWorkout = new Workouts({
        _id: '525a8422f6d0f87f0e407a33'
      });

      // Create new workouts array and include the workout
      scope.workouts = [sampleWorkout];

      // Set expected DELETE response
      $httpBackend.expectDELETE(/api\/workouts\/([0-9a-fA-F]{24})$/).respond(204);

      // Run controller functionality
      scope.remove(sampleWorkout);
      $httpBackend.flush();

      // Test array after successful delete
      expect(scope.workouts.length).toBe(0);
    }));
  });
}());
