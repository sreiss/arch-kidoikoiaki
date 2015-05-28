'use strict'

angular.module('kid')
  .factory('archParticipantService', function(Participant, archHttpService, $q)
  {
    return {
      getParticipant: function(id)
      {
        var deferred = $q.defer();

        Participant.get({id: id}, function(result)
        {
          if(result.count > 0)
          {
            deferred.resolve(result.data);
          }
          else
          {
            deferred.reject(new Erro());
          }
        },
        function(responseError)
        {
          deferred.reject(responseError);
        });

        return deferred.promise;
      },

      deleteParticipant: function(id)
      {
        var deferred = $q.defer();

        Participant.delete({id: id}, function(result)
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
