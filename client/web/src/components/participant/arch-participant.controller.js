'use strict'

angular.module('kid')
  .controller('archParticipantController', function ($scope, Participants, Transactions, Sheet, $stateParams, Participant,$state,$mdToast, archSheetService, archParticipantService, archTransactionService)
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
        $mdToast.show($mdToast.simple().content('Une erreur est survenue lors de la récupération des participants.').position('top right').hideDelay(3000));
      });
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
              $mdToast.show($mdToast.simple().content('Participant supprimé avec succés.').position('top right').hideDelay(3000));
              $state.go($state.current, {}, {reload: true});
            })
            .catch(function()
            {
              $mdToast.show($mdToast.simple().content('Une erreur est survenue à la suppression de ce participant.').position('top right').hideDelay(3000));
            });
          }
          else
          {
            $mdToast.show($mdToast.simple().content('Impossible de supprimer ce participant, celui-ci est lié à une dépense.').position('top right').hideDelay(3000));
          }
        })
        .catch(function()
        {
          $mdToast.show($mdToast.simple().content('Une erreur est survenue lors de la vérification des dépendances.').position('top right').hideDelay(3000));
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
      $scope.participant.prt_notified = false;
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
        console.log($scope.participant);
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
