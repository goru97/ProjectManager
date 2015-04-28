// Code goes here
var myApp = angular.module('app',[]);

myApp.controller('TestCtrl', function($scope, $http){
  var tabClasses;
  
  function initTabs() {
    tabClasses = ["","","",""];
  }
  
  $scope.getTabClass = function (tabNum) {
    return tabClasses[tabNum];
  };
  
  $scope.getTabPaneClass = function (tabNum) {
    return "tab-pane " + tabClasses[tabNum];
  }
  
  $scope.setActiveTab = function (tabNum) {
    initTabs();
    tabClasses[tabNum] = "active";
  };
  
  $scope.tab1 = "This is first section";
  $scope.tab2 = "This is SECOND section";
  
  //Initialize 
  initTabs();
  $scope.setActiveTab(1);

  $scope.openProject= function(){
$http({
url: 'http://localhost:8080/api/openProject',
method: 'GET'
//headers: {'Content-Type': 'application/json'}
}).success(function(data, status, headers, config){ 
alert("Call Successful")

}).
error(function(data, status, headers, config) {
});
    };
});
