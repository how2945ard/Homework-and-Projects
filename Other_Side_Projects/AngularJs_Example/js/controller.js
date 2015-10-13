/*global $ */
/*global angular */
'use strict';

/* Directives */
angular.module('home.controller', [])
  .controller("index", ['$scope', '$http', '$window',
    function($scope, $http, $window) {
      console.log('index')
      $scope.goFuckYourself = function(name) {
        alertify.success('fuck you ' + name + '!')
      }
      $scope.$watch('name', function() {
        if ($scope.name === 'Cliff') {
          alertify.error("Don't! Cliff is shit!")
        }
      })
    }
  ]);
