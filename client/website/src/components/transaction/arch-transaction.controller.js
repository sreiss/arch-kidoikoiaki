angular.module('kid')
  .controller('archTransactionsController', function ($scope, Transactions, Sheet, $stateParams) {
    Sheet.get({she_id: $stateParams.idSheet}, function (sheet) {
      $scope.transactions = Transactions.query({she_id: sheet.data._id});
    });
  })
  .controller('archTransactionNewController', function ($scope, Participants,Categories, Transaction, $location, $mdToast, Sheet , $stateParams, $state, $animate) {
    Sheet.get({she_id: $stateParams.idSheet},
      function (sheet) {
        $scope.participants = Participants.query({she_id: sheet.data._id});
      },
      function (responseError){
        if (responseError.status === 400) {
          console.log(responseError);
        }
      }
    );
    Sheet.get({she_id: $stateParams.idSheet},
      function (sheet) {
        $scope.categories = Categories.query({she_id: sheet.data._id});
      },
      function (responseError){
        if (responseError.status === 400) {
          console.log(responseError);
        }
      }
    );
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
    $scope.transaction = new Transaction();
    Sheet.get({she_id: $stateParams.idSheet}, function (sheet) {
      $scope.transaction.prt_sheet = sheet.data._id;
    });
    $scope.newTransaction = function () {
      $scope.transaction.$save(function () {
        $mdToast.show(
          $mdToast.simple()
            .content('Participants crée')
            .position($scope.getToastPosition())
            .hideDelay(3000)
        );
      });
      $state.go('sheet.transaction');
    }
  });
