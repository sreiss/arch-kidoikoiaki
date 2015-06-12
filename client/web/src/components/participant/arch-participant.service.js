'use strict'

angular.module('kid')
  .factory('archParticipantService', function(Participant, Participants, archHttpService, $q, $state, $mdToast, $mdDialog)
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
      },

      showDeleteDialog: function(sheetId, participantId)
      {
        return $mdDialog.show({
          templateUrl: 'components/participant/arch-participant-delete-dialog.html',
          controller: function ($scope, archTransactionService, archParticipantService, archTranslateService)
          {
            $scope.sheetId = sheetId;
            $scope.participantId = participantId;

            $scope.deleteParticipant = function()
            {
              var isLinked = false;

              archTransactionService.getTransactions($scope.sheetId).then(function(transactions)
              {
                transactions.forEach(function(transaction)
                {
                  if(transaction.trs_contributor._id == $scope.participantId)
                  {
                    isLinked = true;
                  }
                  else
                  {
                    transaction.trs_beneficiaries.forEach(function(beneficiary)
                    {
                      if(beneficiary.trs_participant._id == $scope.participantId)
                      {
                        isLinked = true;
                      }
                    });
                  }
                });

                if(!isLinked)
                {
                  archParticipantService.deleteParticipant($scope.participantId).then(function()
                  {
                    archTranslateService('PARTICIPANT_DELETE_SUCCESS').then(function(translateValue)
                    {
                      $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
                      $state.go($state.current, {}, {reload: true});
                    });
                  })
                  .catch(function()
                  {
                    archTranslateService('PARTICIPANT_DELETE_FAIL').then(function(translateValue)
                    {
                      $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
                    });
                  });
                }
                else
                {
                  archTranslateService('PARTICIPANT_DELETE_FAIL_LINKED').then(function(translateValue)
                  {
                    $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
                  });
                }
              })
              .catch(function()
              {
                archTranslateService('PARTICIPANT_DELETE_FAIL_CHECK_DEPENDENCIES').then(function(translateValue)
                {
                  $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
                });
              });

              $mdDialog.cancel();
            };

            $scope.cancel = function ()
            {
              $mdDialog.cancel();
            };
          }
        });
      }
    };
  });
