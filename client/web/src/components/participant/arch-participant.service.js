'use strict'

angular.module('kid')
  .factory('archParticipantService', function(Participant, Participants, archHttpService, $q)
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
            deferred.reject(new Error());
          }
        },
        function(responseError)
        {
          deferred.reject(responseError);
        });

        return deferred.promise;
      },

      getParticipants: function(id)
      {
        var deferred = $q.defer();

        Participants.query({id: id}, function(result)
        {
          deferred.resolve(result.data);
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
