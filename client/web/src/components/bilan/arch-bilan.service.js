'use strict'

angular.module('kid')
  .factory('archBilanService', function(Bilan, archHttpService, $q)
  {
    return {
      getBilan: function(id)
      {
        var deferred = $q.defer();

        Bilan.get({id: id}, function(result)
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
    };
  });
