var App = angular.module('app', ['ngDragDrop']);

App.controller('kanbanCtrl', function($scope, $timeout) {
  $scope.list1 = [];
  $scope.list2 = [];
  $scope.list3 = [];
  $scope.list4 = [];
  
  /*
  $scope.list5 = [
    { 'title': 'Item 1', 'drag': true },
    { 'title': 'Item 2', 'drag': true },
    { 'title': 'Item 3', 'drag': true },
    { 'title': 'Item 4', 'drag': true },
    { 'title': 'Item 5', 'drag': true },
    { 'title': 'Item 6', 'drag': true },
    { 'title': 'Item 7', 'drag': true },
    { 'title': 'Item 8', 'drag': true }
  ];*/


  $scope.list5 = [
  {'name':'Task1', 'desc':'Description', 'deadline':'Fri May 01 2015 15:43:12 GMT-0700 (PDT)', 'type':'Bug', 'progress':'In Progress'},
   {'name':'Task1', 'desc':'Description', 'deadline':'Fri May 01 2015 15:43:12 GMT-0700 (PDT)', 'type':'Bug', 'progress':'In Progress'}

  ];

  // Limit items to be dropped in list1
  $scope.optionsList1 = {
    accept: function(dragEl) {
      if ($scope.list1.length >= 2) {
        return false;
      } else {
        return true;
      }
    }
  };
});