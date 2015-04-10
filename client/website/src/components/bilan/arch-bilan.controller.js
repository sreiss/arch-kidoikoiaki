angular.module('kid')
  .controller('archBilanController', function ($scope, Sheet ,$stateParams, Bilan)
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
  });

