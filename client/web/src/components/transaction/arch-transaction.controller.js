angular.module('kid')
  .controller('archTransactionsController', function ($scope, Transactions, Sheet, $stateParams, Transaction, $mdToast, $state)
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
        if (result.count > 0)
        {
          $scope.transactions = Transactions.query({she_id: result.data._id});
        }
      },
      function (responseError)
      {
      });
    }
    $scope.deleteTransaction = function (id) {
      if(confirm('Souhaitez-vous réellement supprimer cette dépense ?')) {
        Transaction.delete({id: id}, function (result) {
            if (result.count > 0) {
              $mdToast.show($mdToast.simple()
                  .content('Dépense supprimée avec succés.')
                  .position('top right')
                  .hideDelay(3000)
              );
              $state.go($state.current, {}, {reload: true});
            }
            else {
              $mdToast.show($mdToast.simple()
                  .content('Une erreur est survenue à la suppression de la dépense.')
                  .position('top right')
                  .hideDelay(3000)
              );
            }
          },
          function (responseError) {
            $mdToast.show($mdToast.simple()
                .content('Une erreur est survenue à la suppression de la dépense.')
                .position('top right')
                .hideDelay(3000)
            );
          });
      }
    };
  })
  .controller('archTransactionNewController', function ($scope, Participants, Categories, Transaction, $location, $mdToast, Sheet, $stateParams, $state, $animate) {

    $scope.transaction = new Transaction();
    $scope.tmp_benefs = {};
    Sheet.get({she_id: $stateParams.idSheet},
      function (result) {
        $scope.participants = Participants.query({she_id: result.data._id});
        $scope.categories = Categories.query({she_id: result.data._id});
        $scope.transaction.trs_sheet = result.data._id;
      },
      function (responseError) {
        if (responseError.status === 400) {
          console.log(responseError);
        }
      }
    );
    $scope.newTransaction = function () {
      var log = [];
      angular.forEach($scope.tmp_benefs, function(value, key) {
        var tmp = {
          trs_participant : key,
          trs_weight : value
      };
        this.push(tmp);
      },log);
      console.log(log);
      $scope.transaction.trs_beneficiaries = log;
      console.log($scope.transaction);
      $scope.transaction.$save(function (value) {
        $mdToast.show(
          $mdToast.simple()
            .content('Dépense créée avec succés.')
            .position('top right')
            .hideDelay(3000)
        )
      },
        function (responseError){

            console.log(responseError);

        });
      $state.go('sheet.transactions');
    }

  });
