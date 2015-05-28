'use strict'
angular.module('kid')
  .factory('archSheetService', function(Sheet, archHttpService, $q, httpConstant, $stateParams)
  {
    return {
      getCurrentSheet: function()
      {
        var deferred = $q.defer();

        if($stateParams.idSheet.length == 0)
        {
          deferred.reject(new Error());
        }
        else
        {
          Sheet.get({she_id: $stateParams.idSheet}, function(result)
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
        }

        return deferred.promise;
      }
    };
  });
