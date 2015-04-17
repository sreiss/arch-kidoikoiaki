/**
 * Created by Brian on 29/03/2015.
 */
angular.module('kid')
  .controller('archCategoriesController', function ($scope, Categories, Category, Sheet, $stateParams, $state, $mdToast) {
    Sheet.get({she_id: $stateParams.idSheet}, function (result) {
        if (result.count > 0) {
          $scope.categories = Categories.query({she_id: result.data._id});
        }
      },
      function (responseError) {
      }
    );
    $scope.deleteCategory = function (id) {
      if(confirm('Souhaitez-vous réellement supprimer cette catégorie ?')) {
        Category.delete({id: id}, function (result) {
            if (result.count > 0) {
              $mdToast.show($mdToast.simple()
                  .content('Catégorie supprimée avec succés.')
                  .position('top right')
                  .hideDelay(3000)
              );
              $state.go($state.current, {}, {reload: true});
            }
            else {
              $mdToast.show($mdToast.simple()
                  .content('Une erreur est survenue à la suppression de la catégorie.')
                  .position('top right')
                  .hideDelay(3000)
              );
            }
          },
          function (responseError) {
            $mdToast.show($mdToast.simple()
                .content('Une erreur est survenue à la suppression de la catégorie.')
                .position('top right')
                .hideDelay(3000)
            );
          });
      }
    };
  })
  .controller('archCategoryNewController', function ($scope, Category, $location, $mdToast, Sheet, $stateParams, $state, $animate) {

    $scope.category = new Category();
    $scope.newCategory = function () {
      $scope.category.$save(
        function (value) {
            $mdToast.show(
              $mdToast.simple()
                .content('Catégorie créée avec succés.')
                .position('top right')
                .hideDelay(3000)
            );
          $state.go('sheet.categories');
        }
        ,
        function (responseError) {
          if (responseError.status === 400) {
            console.log(responseError);
          }
        }
      )
    }
  });
