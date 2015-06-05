'use strict';
angular.module('kid')
  .constant('i18nfrFRConstant', {
    APP_TITLE : "ArchKidoikoiaki",
    NAVBAR_MENU : "Menu",

    SIDEBAR_HOME : "Accueil",
    SIDEBAR_PARTICIPANTS : "Participants",
    SIDEBAR_TRANSACTIONS : "Dépenses",
    SIDEBAR_CATEGORIES : "Catégories",
    SIDEBAR_BILAN : "Bilan",

    SHEET_HOME : "Accueil",
    SHEET_P1 : "Vous vivez en colocation, vous partez en vacances entre amis, vous organisez une soirée ou un diner, vous achetez vos cadeaux de noël en famille ? Autant d'occasions d'utiliser notre outil afin de gérer ses comptes communs.",
    SHEET_P2 : "A chaque fois qu'un participant fait une dépense pour le groupe, il l'enregistre dans la liste des dépenses. A la fin, il vous suffit de calculer automatiquement le bilan afin de savoir très simplement qui doit rembourser quoi et à qui.",
    SHEET_NEW_BUTTON : "Nouvelle feuille",
    SHEET_NEW_TITLE : "Ajout d'une feuille",
    SHEET_TITLE : "Nom de la feuille",
    SHEET_REFERENCE : "Réference de la feuille",
    SHEET_MAIL_ADDRESS : "E-mail de contact",
    SHEET_SAVE : "Valider",
    SHEET_EDIT_TITLE : "Modification d'une feuille",
    SHEET_BACK : "Retour",
    SHEET_NEW_SHEET_REQUIRED : "Veuillez au préalable créer une nouvelle feuille.",
    SHEET_NEW_SUCCESS : "Feuille créée avec succès.",
    SHEET_NEW_FAIL : "Une erreur est survenue à la création de la feuille.",
    SHEET_NEW_FAIL_SPAM : "Une feuille vient d'être créée, veuillez patienter 5 secondes avant une nouvelle tentative.",
    SHEET_NEW_FAIL_ALREADY_USED : "Une feuille utilisant cette référence existe déjà.",
    SHEET_EDIT_SUCCESS : "Feuille modifiée avec succès.",
    SHEET_EDIT_FAIL : "Une erreur est survenue à la modification de la feuille.",
    SHEET_ERROR_GET_SHET : "Une erreur est survenue à la récupération de la feuille.",

    PARTICIPANT_TITLE : "Participants",
    PARTICIPANT_NEW_BUTTON : "Nouveau participant",
    PARTICIPANT_NEW_TITLE : "Ajout d'un participant",
    PARTICIPANT_EDIT_TITLE : "Modification d'un participant",
    PARTICIPANT_EMPTY_LIST : "Vous n'avez à ce jour ajouté aucun participant.",
    PARTICIPANT_LNAME : "Nom",
    PARTICIPANT_FNAME : "Prénom",
    PARTICIPANT_MAIL_ADDRESS : "E-mail",
    PARTICIPANT_WEIGHT : "Parts (par défaut)",
    PARTICIPANT_SAVE : "Valider",
    PARTICIPANT_BACK : "Retour",
    PARTICIPANT_NOTIFIED : "Notifier le participant par e-mail ?",
    PARTICIPANT_ERROR_GET_PARTICIPANT : "Une erreur est survenue à la récupération du participant.",
    PARTICIPANT_ERROR_GET_PARTICIPANTS : "Une erreur est survenue lors de la récupération des participants.",
    PARTICIPANT_NEW_SUCCESS : "Participant créé avec succès.",
    PARTICIPANT_NEW_FAIL : "Une erreur est survenue à la création du participant.",
    PARTICIPANT_EDIT_SUCCESS : "Participant modifié avec succès.",
    PARTICIPANT_EDIT_FAIL : "Une erreur est survenue à la modification du participant.",
    PARTICIPANT_DELETE_CONFIRM : "Souhaitez-vous réellement supprimer ce participant ?",
    PARTICIPANT_DELETE_SUCCESS : "Participant supprimé avec succès.",
    PARTICIPANT_DELETE_FAIL : "Une erreur est survenue à la suppression de ce participant.",
    PARTICIPANT_DELETE_FAIL_LINKED : "Impossible de supprimer ce participant, celui-ci est lié à une dépense.",
    PARTICIPANT_DELETE_FAIL_CHECK_DEPENDENCIES : "Une erreur est survenue lors de la vérification des dépendances.",

    TRANSACTION_TITLE : "Dépenses",
    TRANSACTION_NEW_BUTTON : "Nouvelle dépense",
    TRANSACTION_NEW_TITLE : "Ajout d'une dépense",
    TRANSACTION_EDIT_TITLE : "Modification d'une dépense",
    TRANSACTION_EMPTY_LIST : "Vous n'avez à ce jour ajouté aucune dépense.",
    TRANSACTION_PAID : "a dépensé",
    TRANSACTION_CURRENCY : "€",
    TRANSACTION_IN : "dans",
    TRANSACTION_FOR : "Pour",
    TRANSACTION_WEIGHT : "part(s)",
    TRANSACTION_WHO : "Qui ?",
    TRANSACTION_WHAT : "Quoi ?",
    TRANSACTION_HOW_MUCH : "Combien ?",
    TRANSACTION_CATEGORY : "Catégorie ?",
    TRANSACTION_WEIGHTS : "Parts ?",
    TRANSACTION_SAVE : "Valider",
    TRANSACTION_BACK : "Retour",
    TRANSACTION_ERROR_GET_TRANSACTION : "Une erreur est survenue à la récupération de la dépense.",
    TRANSACTION_ERROR_GET_TRANSACTIONS : "Une erreur est survenue à la récupération des dépenses.",
    TRANSACTION_NEW_SUCCESS : "Dépense créée avec succès.",
    TRANSACTION_NEW_FAIL : "Une erreur est survenue à la création de la dépense.",
    TRANSACTION_EDIT_SUCCESS : "Dépense modifiée avec succès.",
    TRANSACTION_EDIT_FAIL : "Une erreur est survenue à la modification de la dépense.",
    TRANSACTION_DELETE_CONFIRM : "Souhaitez-vous réellement supprimer cette dépense ?",
    TRANSACTION_DELETE_SUCCESS : "Dépense supprimée avec succès.",
    TRANSACTION_DELETE_FAIL : "Une erreur est survenue à la suppression de la dépense.",

    CATEGORY_TITLE : "Catégories",
    CATEGORY_NEW_BUTTON : "Nouvelle catégorie",
    CATEGORY_NEW_TITLE : "Ajout d'une catégorie",
    CATEGORY_EDIT_TITLE : "Modification d'une catégorie",
    CATEGORY_EMPTY_LIST : "Vous n'avez à ce jour ajouté aucune catégorie.",
    CATEGORY_NAME : "Nom",
    CATEGORY_DESCRIPTION : "Description",
    CATEGORY_BACK : "Retour",
    CATEGORY_SAVE : "Valider",
    CATEGORY_ERROR_GET_CATEGORY : "Une erreur est survenue lors de la récupération de la catégorie.",
    CATEGORY_ERROR_GET_CATEGORIES : "Une erreur est survenue lors de la récupération des catégories.",
    CATEGORY_NEW_SUCCESS : "Catégorie créée avec succès.",
    CATEGORY_NEW_FAIL : "Une erreur est survenue à la création de la catégorie.",
    CATEGORY_EDIT_SUCCESS : "Catégorie modifiée avec succès.",
    CATEGORY_EDIT_FAIL : "Une erreur est survenue à la modification de la catégorie.",
    CATEGORY_DELETE_CONFIRM : "Souhaitez-vous réellement supprimer cette catégorie ?",
    CATEGORY_DELETE_SUCCESS : "Catégorie supprimée avec succès.",
    CATEGORY_DELETE_FAIL : "Une erreur est survenue à la suppression de la catégorie.",
    CATEGORY_DELETE_FAIL_LINKED : "Impossible de supprimer cette catégorie, celle-ci est liée à une dépense.",
    CATEGORY_DELETE_FAIL_CHECK_DEPENDENCIES : "Une erreur est survenue lors de la vérification des dépendances.",

    BILAN_TITLE : "Bilan",
    BILAN_EMPTY_LIST : "Vous n'avez à ce jour aucune dette.",
    BILAN_MUST_PAY : "doit",
    BILAN_CURRENCY : "€",
    BILAN_TO : "à",
    BILAN_ERROR_DELETE_PREVIOUS_DEBTS : "Une erreur est survenue lors de la suppression des précédentes dettes.",
    BILAN_ERROR_GENERATE_BILAN : "Une erreur est survenue lors de la génération du bilan.",
    BILAN_ERROR_GET_DEBTS : "Une erreur est survenue lors de la récupération des dettes"
  });