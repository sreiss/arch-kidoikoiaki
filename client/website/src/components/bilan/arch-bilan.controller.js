angular.module('kid')
  .controller('archBilanController', function ($scope, Sheet ,$stateParams, Bilan)
  {
    Sheet.get({she_id: $stateParams.idSheet}, function (result) {
        if (result.count > 0) {
          $scope.debts = Bilan.get({she_id: result.data._id});
        }
      },
      function (responseError) {
      }
    );
  });

