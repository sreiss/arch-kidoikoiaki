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


        if(sheetId.length > 0)
        {
          Sheet.get({id: sheetId}, function(result)
          {
            if(result.count > 0)
            {
              if(result.data.she_reference_private == sheetId)
              {
                result.data.isPrivate = true;
              }
              else
              {
                result.data.isPrivate = false;
              }

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
        else
        {
          deferred.reject(new Error());
        }

        return deferred.promise;
      },

      sanitizeReference: function(str)
      {
        return str.replace(/[^\w]/gi, '').toLowerCase();
      }
    };
  });
