'use strict'

angular.module('kid')
  .controller('archParticipantController', function ($scope, Participants, Transactions, Sheet, $stateParams, Participant, $state, archSheetService, archParticipantService, archTransactionService, archToastService)
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
        archToastService.showToast('PARTICIPANT_ERROR_GET_PARTICIPANTS', 'error');
      });
    })
    .catch(function()
    {
      archToastService.showToast('SHEET_NEW_SHEET_REQUIRED', 'error');
      $state.go('sheet.home');
    });

    $scope.deleteParticipant = function(sheetId, participantId)
    {
      archParticipantService.showDeleteDialog(sheetId, participantId);
    };

    $scope.editParticipant = function(id)
    {
      $state.go('sheet.participantEdit', {'idParticipant' : id});
    };
  })
  .controller('archParticipantNewController', function ($scope, Participant, $location, Sheet, $stateParams, $state, archSheetService, archToastService, httpConstant)
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
      archToastService.showToast('SHEET_NEW_SHEET_REQUIRED', 'error');
      $state.go('sheet.home');
    });

    $scope.newParticipant = function ()
    {
      $scope.participant.$save(function()
      {
        archToastService.showToast('PARTICIPANT_NEW_SUCCESS', 'success');
        $state.go('sheet.participants');
      },
      function()
      {
        archToastService.showToast('PARTICIPANT_NEW_FAIL', 'error');
      })
    }
  })
  .controller('archParticipantEditController', function ($scope, Participant, $state, $stateParams, archParticipantService, archToastService)
  {
    $scope.participant = new Participant();

    archParticipantService.getParticipant($stateParams.idParticipant).then(function(participant)
    {
      $scope.participant = participant;
    })
    .catch(function()
    {
      archToastService.showToast('PARTICIPANT_ERROR_GET_PARTICIPANT', 'error');
      $state.go('sheet.participants');
    });

    $scope.editParticipant = function ()
    {
      Participant.update({participant:$scope.participant}, function()
      {
        archToastService.showToast('PARTICIPANT_EDIT_SUCCESS', 'success');
        $state.go('sheet.participants');
      },
      function()
      {
        archToastService.showToast('PARTICIPANT_EDIT_FAIL', 'error');
      });
    }
  });
