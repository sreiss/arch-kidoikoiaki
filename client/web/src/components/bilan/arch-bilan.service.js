'use strict'

angular.module('kid')
  .factory('archBilanService', function(Bilan, Debt, archHttpService, $q)
  {
    return {
      deleteDebts: function(id)
      {
        var deferred = $q.defer();

        Debt.delete({id: id}, function(result)
        {
          deferred.resolve(result.data);
        },
        function(responseError)
        {
          deferred.reject(responseError);
        });

        return deferred.promise;
      },

      generateBilan: function(id)
      {
        var deferred = $q.defer();

        Bilan.get({id: id}, function(result)
        {
          deferred.resolve(result.data);
        },
        function(responseError)
        {
          deferred.reject(responseError);
        });

        return deferred.promise;
      },

      getDebts: function(id)
      {
        var deferred = $q.defer();

        Debt.get({id: id}, function(result)
        {
            deferred.resolve(result.data);
        },
        function(responseError)
        {
          deferred.reject(responseError);
        });

        return deferred.promise;
      }
    };
  });
