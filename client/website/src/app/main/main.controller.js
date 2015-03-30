'use strict';

angular.module('kid')
.controller('archSheetNewController', function($scope, $location,$mdToast, Sheet,$stateParams, $state,$animate){
  $scope.toastPosition = {
    bottom: false,
    top: true,
    left: false,
    right: true
  };
  $scope.getToastPosition = function () {
    return Object.keys($scope.toastPosition)
      .filter(function (pos) {
        return $scope.toastPosition[pos];
      })
      .join(' ');
  };
    $scope.sheet = new Sheet();
    $scope.sheet.she_reference = Math.random().toString(36).substring(3);
  $scope.newSheet = function() {
    $scope.sheet.$save(
      function (value) {
          $mdToast.show(
            $mdToast.simple()
              .content('Feuille crée')
              .position($scope.getToastPosition())
              .hideDelay(3000)
          );
        $state.transitionTo('sheet.participants', {'idSheet' : value.data.she_reference})
      }
      ,
      function (responseError) {
        if (responseError.status === 400) {
          console.log(responseError);
        }

      }
    );
  }
})
