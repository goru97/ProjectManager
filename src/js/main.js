// Code goes here
var myApp = angular.module('app',['ui.bootstrap', 'ngGrid']);
var removeTemplate = '<input type="button" value="remove" ng-click="removeRow($index)" />';
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
open('sm');

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

//Task Grid


 $scope.taskGridData = [{name: "Moroni", duration: 50, duration:2, start: "4/14/16", end:"4/24/16", resources: "2343"},
                      {name: "Moronir", duration: 50, duration:2, start: "4/14/16", end:"4/24/16", resources: "2343"},
                      {name: "Moronim", duration: 50, duration:2, start: "4/14/16", end:"4/24/16", resources: "2343"},
                      {name: "Moronio", duration: 50, duration:2, start: "4/14/16", end:"4/24/16", resources: "2343"},
                      {name: "Moronib", duration: 50, duration:2, start: "4/14/16", end:"4/24/16", resources: "2343"}];

    $scope.taskGridOptions= { 
      data: 'taskGridData' ,
     showFilter: true,
        showColumnMenu: true,
        enableCellSelection: true,
        enableRowSelection: false,
        enableCellEditOnFocus: true,
        showSelectionCheckbox: true,
        selectWithCheckboxOnly: true,
        selectedItems: $scope.selectedTasks,
        showFooter: true,
        columnDefs: [{field: 'name', displayName: 'Name', enableCellEdit: true}, 
                     {field:'duration', displayName:'Duration', enableCellEdit: true},
                     {field:'start', displayName:'Start', enableCellEdit: true},
                     {field:'end', displayName:'End', enableCellEdit: true},
                     {field:'resources', displayName:'Resources', enableCellEdit: true},
                     {field: 'remove', displayName:'', cellTemplate: removeTemplate}]};

 $scope.addTask = function() {
    $scope.taskGridData.push({});
  };

    $scope.removeRow = function(index) {
        $scope.taskGridData.splice(index,1);
    };

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

