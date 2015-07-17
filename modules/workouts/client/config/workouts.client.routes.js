'use strict';

// Setting up route
angular.module('workouts').config(['$stateProvider',
  function($stateProvider) {
    // Workouts state routing
    $stateProvider.
    state('workouts', {
      abstract: true,
      url: '/workouts',
      template: '<ui-view/>'
    }).
    state('workouts.list', {
      url: '',
      templateUrl: 'modules/workouts/views/list-workouts.client.view.html'
    }).
    state('workouts.create', {
      url: '/create',
      templateUrl: 'modules/workouts/views/create-workout.client.view.html'
    }).
    state('workouts.view', {
      url: '/:workoutId',
      templateUrl: 'modules/workouts/views/view-workout.client.view.html'
    }).
    state('workouts.edit', {
      url: '/:workoutId/edit',
      templateUrl: 'modules/workouts/views/edit-workout.client.view.html'
    });
  }
]);
