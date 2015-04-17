'use strict';
angular.module('kid')
  .controller('archSheetNewController', function($scope, $location, $mdToast, Sheet,$stateParams, $state) {
    $scope.newSheet = function()
    {
      Sheet.get({}, function(result)
      {
        if(result.count > 0)
        {
          $state.transitionTo('sheet.participants', {'idSheet' : result.data.she_reference})
        }
        else
        {
          $mdToast.show($mdToast.simple()
            .content('Une erreur est survenue à la création de la feuille.')
            .position('top right')
            .hideDelay(3000)
          );
        }
      },
      function(responseError)
      {
        $mdToast.show($mdToast.simple()
          .content('Une erreur est survenue à la création de la feuille.')
          .position('top right')
          .hideDelay(3000)
        );
      });
    };
    if($stateParams.idSheet) {
      $scope.path = $state.href($state.current.name, $state.params, {absolute: true})
    }
  });
