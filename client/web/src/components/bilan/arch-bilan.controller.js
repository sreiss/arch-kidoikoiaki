'use strict'

angular.module('kid')
  .controller('archBilanController', function ($scope, Sheet ,$stateParams, $mdToast, $state, Bilan)
  {
    if($stateParams.idSheet.length == 0)
    {
      // Avoid navigate without sheetReference.
      $mdToast.show($mdToast.simple()
          .content('Veuillez au préalable créer une nouvelle feuille.')
          .position('top right')
          .hideDelay(3000)
      );
      $state.go('sheet.home');
    }
    else
    {
      Sheet.get({she_id: $stateParams.idSheet}, function (result)
      {
        $scope.debts = Bilan.get({she_id: result.data._id});
      },
      function (responseError)
      {
        $mdToast.show(
          $mdToast.simple()
            .content('Une erreur est survenue à la récupération du bilan.')
            .position('top right')
            .hideDelay(3000)
        );
      });
    }
  });

