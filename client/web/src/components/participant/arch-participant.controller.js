'use strict'

angular.module('kid')
  .controller('archParticipantController', function ($scope, Participants, Sheet, $stateParams, Participant,$state,$mdToast, archSheetService, archParticipantService)
  {
    $scope.participants = new Array();

    archSheetService.getCurrentSheet().then(function(sheet)
    {
      $scope.participants = Participants.query({id: sheet._id});
    })
    .catch(function()
    {
      $mdToast.show($mdToast.simple().content('Veuillez au préalable créer une nouvelle feuille.').position('top right').hideDelay(3000));
      $state.go('sheet.home');
    });

    $scope.deleteParticipant = function(id)
    {
      if(confirm('Souhaitez-vous réellement supprimer ce participant ?'))
      {
        archParticipantService.deleteParticipant(id).then(function()
        {
          $mdToast.show($mdToast.simple().content('Participant supprimé avec succés.').position('top right').hideDelay(3000));
          $state.go($state.current, {}, {reload: true});
        })
        .catch(function()
        {
          $mdToast.show($mdToast.simple().content('Une erreur est survenue à la suppression de ce participant.').position('top right').hideDelay(3000));
        });
      }
    };

    $scope.editParticipant = function(id)
    {
      $state.go('sheet.participantEdit', {'idParticipant' : id});
    };
  })
  .controller('archParticipantNewController', function ($scope, Participant, $location, $mdToast, Sheet, $stateParams, $state, archSheetService, archParticipantService)
  {
    $scope.participant = new Participant();

    archSheetService.getCurrentSheet().then(function(sheet)
    {
      $scope.participant.prt_sheet = sheet._id;
    })
    .catch(function()
    {
      $mdToast.show($mdToast.simple().content('Veuillez au préalable créer une nouvelle feuille.').position('top right').hideDelay(3000));
      $state.go('sheet.home');
    });

    $scope.newParticipant = function ()
    {
      $scope.participant.$save(function()
      {
        $mdToast.show($mdToast.simple().content('Participant créé avec succés.').position('top right').hideDelay(3000));
        $state.go('sheet.participants');
      },
      function()
      {
        $mdToast.show($mdToast.simple().content('Une erreur est survenue à la création du participant.').position('top right').hideDelay(3000));
      })
    }
  })
  .controller('archParticipantEditController', function ($scope, Participant, $state, $stateParams, $mdToast, archParticipantService)
  {
    $scope.participant = new Participant();

    archParticipantService.getParticipant($stateParams.idParticipant).then(function(participant)
    {
      $scope.participant = participant;
    })
    .catch(function()
    {
      $mdToast.show($mdToast.simple().content('Une erreur est survenue à la récupération du participant.').position('top right').hideDelay(3000));
      $state.go('sheet.participants');
    });

    $scope.editParticipant = function ()
    {
      Participant.update({participant:$scope.participant}, function()
      {
        $mdToast.show($mdToast.simple().content('Participant modifié avec succés.').position('top right').hideDelay(3000));
        $state.go('sheet.participants');
      },
      function()
      {
        $mdToast.show($mdToast.simple().content('Une erreur est survenue à la modification du participant.').position('top right').hideDelay(3000));
      });
    }
  });
