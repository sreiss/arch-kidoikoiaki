'use strict'

angular.module('kid')
  .factory('archSheetService', function(Sheet, archHttpService, $q, httpConstant, $stateParams)
  {
    return {
      getSheet: function()
      {
        var deferred = $q.defer();

        Sheet.get({}, function(result)
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

      getCurrentSheet: function()
      {
        var deferred = $q.defer();

        var sheetId = $stateParams.idSheet || '';

        if(sheetId.length === 0)
        {
          deferred.reject(new Error());
        }
        else
        {
          Sheet.get({id: sheetId}, function(result)
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
