'use strict';

angular.module('kid', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ngMaterial','ui.router'])
  .config(function ($mdThemingProvider, $stateProvider, $urlRouterProvider) {
    $mdThemingProvider
      .theme('default')
      .primaryPalette('deep-orange')
      .accentPalette('teal', {
        'default': '500'
      });

    $stateProvider
      .state('home', {
        url: "/",
        templateUrl: "app/main/main.html"
      })
      .state('sheet', {
        url: '/sheet/:idSheet',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('sheet.participants', {
        url: '/participants',
        templateUrl: 'components/participant/arch-participant.html',
        controller: 'archParticipantController'

      })
      .state('sheet.partcipantNew', {
        url: "/participant/new",
        templateUrl: "components/participant/arch-participant-new.html",
        controller: "archParticipantNewController"
      })
      .state('sheet.partcipantEdit', {
        url: "/participant/:idParticipant/edit",
        templateUrl: "components/participant/arch-participant-edit.html",
        controller: "archPartcipantEditController"
      })
      .state('sheet.transactions', {
        url: "/transactions",
        templateUrl: "components/transaction/arch-transaction.html",
        controller: "archTransactionsController"
      })
      .state('sheet.transactionNew', {
        url: "/transaction/new",
        templateUrl: "components/transaction/arch-transaction-new.html",
        controller: "archTransactionNewController"
      })
      .state('sheet.transactionEdit', {
        url: "/transaction/:idTransaction/edit",
        templateUrl: "components/transaction/arch-transaction-edit.html",
        controller: "archParticipantEditController"
      })
      .state('sheet.categories', {
        url: "/categories",
        templateUrl: "components/category/arch-categories.html",
        controller: "archCategoriesController"
      })
      .state('sheet.categoryNew', {
        url: "/category/new",
        templateUrl: "components/category/arch-category-new.html",
        controller: "archCategoryNewController"
      })
      .state('sheet.categoryEdit', {
        url: "/category/:idCategory/edit",
        templateUrl: "components/category/arch-category.html",
        controller: "archCategoryEditController"
      });

      $urlRouterProvider
        .otherwise("/");
  });
