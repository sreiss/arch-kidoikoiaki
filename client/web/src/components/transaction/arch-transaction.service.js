'use strict'

angular.module('kid')
  .factory('archTransactionService', function(Transaction, archHttpService, $q)
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
