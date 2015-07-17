'use strict';

//Workouts service used for communicating with the workouts REST endpoints
angular.module('workouts').factory('Workouts', ['$resource',
  function($resource) {
    return $resource('api/workouts/:workoutId', {
      workoutId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
