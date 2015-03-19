/**
 * Created by Brian on 12/03/2015.
 */
'use strict';

angular.module('kid')
.directive('kidSidebar', function() {
  return {
    restrict: 'E',
    templateUrl: 'components/sidebar/sidebar.html'
  }
});
