'use strict';

describe('Workouts E2E Tests:', function() {
  describe('Test workouts page', function() {
    it('Should display a list of workouts', function() {
      browser.get('http://localhost:3000/workouts');
      expect(element.all(by.repeater('workout in workouts')).count()).toEqual(5);
    });
  });
});
