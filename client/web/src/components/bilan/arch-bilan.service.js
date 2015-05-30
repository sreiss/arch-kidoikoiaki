'use strict'

angular.module('kid')
  .factory('archBilanService', function(Bilan, archHttpService, $q)
  {
    return {
      getDebts: function(id)
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
      }
    };
  });
