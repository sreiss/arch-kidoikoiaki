'use strict'

angular.module('kid')
  .factory('archParticipantService', function(Participant, Participants, archHttpService, $q, $state, $mdDialog)
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
          controller: function ($scope, archTransactionService, archParticipantService, archToastService)
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
                    archToastService.showToast('PARTICIPANT_DELETE_SUCCESS', 'success');
                    $state.go($state.current, {}, {reload: true});
                  })
                  .catch(function()
                  {
                    archToastService.showToast('PARTICIPANT_DELETE_FAIL', 'error');
                  });
                }
                else
                {
                  archToastService.showToast('PARTICIPANT_DELETE_FAIL_LINKED', 'error');
                }
              })
              .catch(function()
              {
                archToastService.showToast('PARTICIPANT_DELETE_FAIL_CHECK_DEPENDENCIES', 'error');
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
