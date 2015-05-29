'use strict'

angular.module('kid')
  .factory('archTransactionService', function(Transaction, Transactions, archHttpService, $q)
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
      }
    };
  });
