// Code goes here
var myApp = angular.module('app',['ui.bootstrap', 'ngGrid']);
var removeTaskTemplate = '<input type="button" value="remove" ng-click="removeTask($index)" />';
var removeResourceTemplate = '<input type="button" value="remove" ng-click="removeResource($index)" />';

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
url: 'http://localhost:8080/api/openProject/goru97',
method: 'GET'
//headers: {'Content-Type': 'application/json'}
}).success(function(data, status, headers, config){ 
//console.log(JSON.stringify(data));
$scope.projects = data.projects; //Getting all the projects

$scope.items =[];
for (i = 0; i < $scope.projects.length; i++) {
$scope.items.push($scope.projects[i].project_name);
}
console.log(JSON.stringify($scope.projects));
open('sm');

}).
error(function(data, status, headers, config) {
});
    };

$scope.saveProject = function(){

var user = {
username:"goru97",
project:{
  project_name:"CRC",
  tasks: $scope.taskGridData,
  resources:$scope.resourceGridData
}

};


$http({
url: "http://localhost:8080/api/saveProject",
method: 'POST',
data: user,
headers: {'Content-Type': 'application/json'}
}).success(function(data, status, headers, config){
return data;
}).
error(function(data, status, headers, config) {
});


//postData("http://localhost:8080/api/saveProject",user);

};

var postData = function(URL, DATA){

$http({
url: URL,
method: 'POST',
data: DATA,
headers: {'Content-Type': 'application/json'}
}).success(function(data, status, headers, config){
return data;
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

var projects = $scope.projects;
for(i=0;i<projects.length;i++){
if(projects[i].project_name == selectedItem){
$scope.taskGridData = projects[i].tasks;
break;
}

}

     // alert("Done");
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
//Modal ends here


//Resource starts here
$scope.resourceGridData = [{}];

/*[{name: "Moroni", email: 50, type:2, cost: "500"},
                           {name: "Moronir", email: 50, type:2, cost: "500"}]*/;

 $scope.resourceGridOptions= { 
      data: 'resourceGridData' ,
     showFilter: true,
        showColumnMenu: true,
        enableCellSelection: true,
        enableRowSelection: false,
        enableCellEditOnFocus: true,
        showSelectionCheckbox: true,
        selectWithCheckboxOnly: true,
        selectedItems: $scope.selectedResources,
        showFooter: true,
        columnDefs: [{field: 'name', displayName: 'Name', enableCellEdit: true}, 
                     {field:'email', displayName:'Email', enableCellEdit: true},
                     {field:'type', displayName:'Type', enableCellEdit: true},
                     {field:'cost', displayName:'Cost', enableCellEdit: true}
                     ]};

   $scope.addResource = function() {
    $scope.resourceGridData.push({});
  };

   $scope.removeResource = function() {
                    var index = this.row.rowIndex;
                    $scope.resourceGridOptions.selectItem(index, false);
                    $scope.resourceGridData.splice(index, 1);
                }

//Task Grid

 $scope.taskGridData = [];

 /*[{name: "Moroni", duration: 50, start: "4/14/16", end:"4/24/16", resources:"Pandey, Saumil"},
                      {name: "Moronir", duration: 50, start: "4/14/16", end:"4/24/16", resources: "Gaurav, Jalaj"}];
*/

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
                     {field:'resources', displayName:'Resources', enableCellEdit: true}, //, cellFilter: 'resourceFilter'},
                     {field: 'remove', displayName:'', cellTemplate: removeTaskTemplate, enableCellEdit: false}]};

 $scope.addTask = function() {
    $scope.taskGridData.push({});
  };

   $scope.removeTask = function() {
                    var index = this.row.rowIndex;
                    $scope.taskGridOptions.selectItem(index, false);
                    $scope.taskGridData.splice(index, 1);
                };

});
/*
.filter('resourceFilter', function() {
  return function(myArray) {   
return myArray.join(",")
  };
  
});
*/





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

