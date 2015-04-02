angular.module('kid')
  .controller('archTransactionsController', function ($scope, Transactions, Sheet, $stateParams) {
    Sheet.get({she_id: $stateParams.idSheet}, function (sheet) {
      $scope.transactions = Transactions.query({she_id: sheet.data._id});
      console.log($scope.transactions);
      console.log(sheet.data._id);
    });
  })
  .controller('archTransactionNewController', function ($scope, Participants,Categories, Transaction, $location, $mdToast, Sheet , $stateParams, $state, $animate) {
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
    Sheet.get({she_id: $stateParams.idSheet},
      function (sheet) {
        $scope.participants = Participants.query({she_id: sheet.data._id});
        $scope.categories = Categories.query({she_id: sheet.data._id});
        $scope.transaction.trs_sheet = sheet.data._id;
      },
      function (responseError){
        if (responseError.status === 400) {
          console.log(responseError);
        }
      }
    );
    $scope.transaction.trs_beneficiaries = [{"trs_participant" : "551c52b6d626f1cc1ab1593e", "trs_weight" : "2"}];
    $scope.newTransaction = function () {
      console.log($scope.transaction);
      $scope.transaction.$save(function (value) {
        $mdToast.show(
          $mdToast.simple()
            .content('Transaction crée')
            .position($scope.getToastPosition())
            .hideDelay(3000)
        )
      },
        function (responseError){

            console.log(responseError);

        });
      $state.go('sheet.transactions');
    }
  });
