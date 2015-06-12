'use strict'

angular.module('kid')
  .controller('archParticipantController', function ($scope, Participants, Transactions, Sheet, $stateParams, Participant,$state,$mdToast, archSheetService, archParticipantService, archTransactionService, archTranslateService)
  {
    $scope.participants = new Array();
    $scope.sheet = new Sheet();

    archSheetService.getCurrentSheet().then(function(sheet)
    {
      $scope.sheet = sheet;

      archParticipantService.getParticipants(sheet._id).then(function(participants)
      {
        $scope.participants = participants;
      })
      .catch(function()
      {
        archTranslateService('PARTICIPANT_ERROR_GET_PARTICIPANTS').then(function(translateValue)
        {
          $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
        });
      });
    })
    .catch(function()
    {
      archTranslateService('SHEET_NEW_SHEET_REQUIRED').then(function(translateValue)
      {
        $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
        $state.go('sheet.home');
      });
    });

    $scope.deleteParticipant = function(id)
    {
      archTranslateService('PARTICIPANT_DELETE_CONFIRM').then(function(translateValue)
      {
        if(confirm(translateValue))
        {
          var isLinked = false;

          archTransactionService.getTransactions($scope.sheet._id).then(function(transactions)
          {
            transactions.forEach(function(transaction)
            {
              if(transaction.trs_contributor._id == id)
              {
                isLinked = true;
              }
              else
              {
                transaction.trs_beneficiaries.forEach(function(beneficiary)
                {
                  if(beneficiary.trs_participant._id == id)
                  {
                    isLinked = true;
                  }
                });
              }
            });

            if(!isLinked)
            {
              archParticipantService.deleteParticipant(id).then(function()
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
        }
      });
    };

    $scope.editParticipant = function(id)
    {
      $state.go('sheet.participantEdit', {'idParticipant' : id});
    };
  })
  .controller('archParticipantNewController', function ($scope, Participant, $location, $mdToast, Sheet, $stateParams, $state, archSheetService, archTranslateService, httpConstant)
  {
    $scope.participant = new Participant();

    archSheetService.getCurrentSheet().then(function(sheet)
    {
      $scope.participant.prt_sheet = sheet._id;
      $scope.participant.prt_notified = false;
      $scope.participant.she_path = httpConstant.clientUrl;
    })
    .catch(function()
    {
      archTranslateService('SHEET_NEW_SHEET_REQUIRED').then(function(translateValue)
      {
        $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
        $state.go('sheet.home');
      });
    });

    $scope.newParticipant = function ()
    {
      $scope.participant.$save(function()
      {
        archTranslateService('PARTICIPANT_NEW_SUCCESS').then(function(translateValue)
        {
          $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
          $state.go('sheet.participants');
        });
      },
      function()
      {
        archTranslateService('PARTICIPANT_NEW_FAIL').then(function(translateValue)
        {
          $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
        });
      })
    }
  })
  .controller('archParticipantEditController', function ($scope, Participant, $state, $stateParams, $mdToast, archParticipantService, archTranslateService)
  {
    $scope.participant = new Participant();

    archParticipantService.getParticipant($stateParams.idParticipant).then(function(participant)
    {
      $scope.participant = participant;
    })
    .catch(function()
    {
      archTranslateService('PARTICIPANT_ERROR_GET_PARTICIPANT').then(function(translateValue)
      {
        $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
        $state.go('sheet.participants');
      });
    });

    $scope.editParticipant = function ()
    {
      Participant.update({participant:$scope.participant}, function()
      {
        archTranslateService('PARTICIPANT_EDIT_SUCCESS').then(function(translateValue)
        {
          $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
          $state.go('sheet.participants');
        });
      },
      function()
      {
        archTranslateService('PARTICIPANT_EDIT_FAIL').then(function(translateValue)
        {
          $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
        });
      });
    }
  });
