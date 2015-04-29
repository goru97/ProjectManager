// Code goes here
var myApp = angular.module('app',['ui.bootstrap', 'ngGrid']);

myApp.controller('mainCtrl', function($scope, $http, $modal, $log){
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
  
  $scope.tab1 = "This is first tab";
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
//console.log(JSON.stringify(data));
$scope.projects = data.projects; //Getting all the projects

for (i = 0; i < $scope.projects.length; i++) {
$scope.items.push($scope.projects[i].project_name);
}
console.log(JSON.stringify($scope.projects));
open('lg');

}).
error(function(data, status, headers, config) {
});
    };
//Modal starts here

$scope.items = [];

 var open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
//Modal ends here

 $scope.gridData = [{name: "Moroni", age: 50},
                     {name: "Tiancum", age: 43},
                     {name: "Jacob", age: 27},
                     {name: "Nephi", age: 29},
                     {name: "Enos", age: 34}];
    $scope.gridOptions = { data: 'gridData' ,
        enableCellSelection: true,
        enableRowSelection: false,
        enableCellEditOnFocus: true,
        columnDefs: [{field: 'name', displayName: 'Name', enableCellEdit: true}, 
                     {field:'age', displayName:'Age', enableCellEdit: true}]};




});



angular.module('app').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

