/*global $ */
/*global angular */
'use strict';

/* Directives */
angular.module('demo01.controller', [])
  .controller("demo01", ['$scope', '$http', '$window',
    function($scope, $http, $window) {
      console.log('demo01')
      $scope.lists = []
      $scope.addList = function(list) {
        if (!list) {
          return;
        }
        var newList = list
        newList.done = false
        $scope.lists.push(newList)
        delete $scope.newList
      }
      $scope.deleteList = function($index) {
        $scope.lists.splice($index, 1)
        if (!$index) {
          return;
        }
      }
    }
  ]);
