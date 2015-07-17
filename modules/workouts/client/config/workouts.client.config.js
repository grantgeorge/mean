'use strict';

// Configuring the Workouts module
angular.module('workouts').run(['Menus',
  function(Menus) {
    // Add the workouts dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Workouts',
      state: 'workouts',
      type: 'dropdown',
      position: 0
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'workouts', {
      title: 'List Workouts',
      state: 'workouts.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'workouts', {
      title: 'Create Workouts',
      state: 'workouts.create'
    });
  }
]);
