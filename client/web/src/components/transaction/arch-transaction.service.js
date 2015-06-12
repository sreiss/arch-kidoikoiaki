'use strict'

angular.module('kid')
  .factory('archTransactionService', function(Transaction, Transactions, archHttpService, $q, $state, $mdToast, $mdDialog)
  {
    return {
      getTransaction: function(id)
      {
        var deferred = $q.defer();

        Transaction.get({id: id}, function(result)
        {
          if(result.count > 0)
          {
            deferred.resolve(result.data);
          }
          else
          {
            deferred.reject(new Error());
          }
        },
        function(responseError)
        {
          deferred.reject(responseError);
        });

        return deferred.promise;
      },

      getTransactions: function(id)
      {
        var deferred = $q.defer();

        Transactions.query({id: id}, function(result)
        {
          deferred.resolve(result.data);
        },
        function(responseError)
        {
          deferred.reject(responseError);
        });

        return deferred.promise;
      },

      deleteTransaction: function(id)
      {
        var deferred = $q.defer();

        Transaction.delete({id: id}, function(result)
        {
          if(result.count > 0)
          {
            deferred.resolve(result.data);
          }
          else
          {
            deferred.reject(new Error());
          }
        },
        function(responseError)
        {
          deferred.reject(responseError);
        });

        return deferred.promise;
      },

      showDeleteDialog: function(transactionId)
      {
        return $mdDialog.show({
          templateUrl: 'components/transaction/arch-transaction-delete-dialog.html',
          controller: function ($scope, archTransactionService, archTranslateService)
          {
            $scope.transactionId = transactionId;

            $scope.deleteTransaction = function()
            {
              archTransactionService.deleteTransaction($scope.transactionId).then(function()
              {
                archTranslateService('TRANSACTION_DELETE_SUCCESS').then(function(translateValue)
                {
                  $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
                  $state.go($state.current, {}, {reload: true});
                });
              })
              .catch(function()
              {
                archTranslateService('TRANSACTION_DELETE_FAIL').then(function(translateValue)
                {
                  $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
                });
              });

              $mdDialog.cancel();
            };

            $scope.cancel = function ()
            {
              $mdDialog.cancel();
            };
          }
        });
      }
    };
  });
