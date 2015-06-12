'use strict'
angular.module('kid')
  .factory('archTranslateService', function($translate)
  {
    return function(toTranslate)
    {
      return $translate(toTranslate)
        .catch(function(err)
        {
          return toTranslate;
        })
        .then(function(translation)
        {
          return translation;
        });
    };
  });
