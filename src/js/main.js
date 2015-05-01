// Code goes here
var myApp = angular.module('app',['ui.bootstrap', 'ngGrid', 'ui.bootstrap.datetimepicker']);
var removeTaskTemplate = '<div style="text-align:center; vertical-align: middle"><input style="text-align:center; vertical-align: middle" type="button" class = "btn btn-mini btn-danger" value="remove" ng-click="removeTask($index)" /></div>';
var removeResourceTemplate = '<div style="text-align:center; vertical-align: middle"><input style="text-align:center; vertical-align: middle" type="button" class = "btn btn-mini btn-danger" value="remove" ng-click="removeResource($index)" /></div>';
var startDateTemplate = '<div class="dropdown"><a class="dropdown-toggle" id="dropdown1" role="button" data-toggle="dropdown" data-target="#" href="#"><div class="input-group"><input type="text" class="form-control" data-ng-model="row.entity.start"><span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span></div></a><ul class="dropdown-menu" role="menu" aria-labelledby="dLabel"><datetimepicker data-on-set-time="onStartTimeSet(newDate, oldDate, row.entity)" data-ng-model="data.startDate" data-datetimepicker-config="{ dropdownSelector: \'#dropdown1\' }"/></ul></div>';
var endDateTemplate = '<div class="dropdown"><a class="dropdown-toggle" id="dropdown2" role="button" data-toggle="dropdown" data-target="#" href="#"><div class="input-group"><input type="text" class="form-control" data-ng-model="row.entity.end"><span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span></div></a><ul class="dropdown-menu" role="menu" aria-labelledby="dLabel"><datetimepicker data-on-set-time="onEndTimeSet(newDate, oldDate, row.entity)" data-ng-model="data.endDate" data-datetimepicker-config="{ dropdownSelector: \'#dropdown2\' }"/></ul></div>';
var progressBarTemplate = '<progressbar animate="false" value="row.entity.progress" type="success"><b>{{row.entity.progress}}%</b></progressbar>';

myApp.controller('mainCtrl', function($scope, $http, $modal, $log){
  var tabClasses;
  
  function initTabs() {
    tabClasses = ["","","",""];
  }
  

var dateJStoDT = function convertDate(inputFormat) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat);
  return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
}

//Function on setting start date
  $scope.onStartTimeSet = function (newDate, oldDate, entity) {
  var startDate = new Date(newDate);
  var endDate = new Date(entity.end);
  var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
  if(endDate == 'Invalid Date'){
    entity.start = newDate;
    entity.progress = 0;
  }
else if(endDate < startDate)
  alert("Start date cannot be more than End date! Please select correct dates.");
else{
  entity.start = newDate;
  entity.duration = Math.round(Math.abs((startDate.getTime() - endDate.getTime())/(oneDay)));

var currentDate = new Date();
  if(startDate > currentDate)
 entity.progress = 0;
else if (endDate < currentDate )
  entity.progress = 100;
else
  entity.progress = parseInt(((Math.round(Math.abs((startDate.getTime() - currentDate.getTime())/(oneDay)))/entity.duration)*100));


}
 
}

//Function on setting end date
 $scope.onEndTimeSet = function (newDate, oldDate, entity) {
  var endDate = new Date(newDate);
  var startDate = new Date(entity.start);
  var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
  if(startDate == 'Invalid Date')
    alert("Please select Start date first!");
  else if(startDate>endDate)
    alert("End date cannot be less than Start date! Please select correct dates.");
else{
  entity.end = newDate;
  entity.duration = Math.round(Math.abs((startDate.getTime() - endDate.getTime())/(oneDay)));
var currentDate = new Date();
if(startDate > currentDate)
 entity.progress = 0;
else if (endDate < currentDate )
  entity.progress = 100;
else
  entity.progress = parseInt(((Math.round(Math.abs((startDate.getTime() - currentDate.getTime())/(oneDay)))/entity.duration)*100));


}

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

  $scope.newProject = function(){
    if (confirm("Have you saved your current Project?") == true) {
       $scope.taskGridData = [{}];
       $scope.resourceGridData = [{}];
    } else {
       
    }
  }

  $scope.openProject= function(){

$http({
url: 'http://localhost:8080/api/openProject/goru97',
method: 'GET'
//headers: {'Content-Type': 'application/json'}
}).success(function(data, status, headers, config){ 
//console.log(JSON.stringify(data));

var projects = data.projects;
var newProjects =[];
for(i=0;i<projects.length;i++){
  var newProject ={};
  newProject.project_id = projects[i].project_id;
  newProject.project_name = projects[i].project_name;
  newProject.project_type = projects[i].project_type;
  newProject.resources = projects[i].resources;

var tasks = projects[i].tasks;
  var newTasks = [];

  for(j=0;j<tasks.length;j++){
    var newTask ={};
    newTask.project_id = tasks[j].project_id;
    newTask.task_id = tasks[j].task_id;
    newTask.name = tasks[j].name;
    newTask.duration = tasks[j].duration;
    newTask.start = new Date(tasks[j].start);
    newTask.end = new Date(tasks[j].end);
    newTask.progress = tasks[j].progress;
    newTask.resources = tasks[j].resources;
    newTasks.push(newTask);
  }
newProject.tasks = newTasks;
newProjects.push(newProject);

}

//$scope.projects = data.projects; //Getting all the projects

$scope.projects = newProjects;
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

var saveProject = function(Username, projectName){

var user = {
username:Username,
project:{
  project_name:projectName,
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
$scope.resourceGridData = projects[i].resources;
break;
}

}

     // alert("Done");
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
//Modal ends here


//Save confirm Box start
$scope.save = function (size) {


    var modalInstance = $modal.open({
      templateUrl: 'saveModalContent.html',
      controller: 'saveModalCtrl',
      size: size,
      resolve: {
        projectName: function () {
          return $scope.projectName;
        }
      }
    });

    modalInstance.result.then(function (projectName) {
      saveProject("goru97",projectName);

     // alert("Done");
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

//Save confirm Box end


//Resource starts here
$scope.resourceGridData = [{}];

/*[{name: "Moroni", email: 50, type:2, cost: "500"},
                           {name: "Moronir", email: 50, type:2, cost: "500"}]*/;

 $scope.resourceGridOptions= { 
      data: 'resourceGridData' ,
     showFilter: true,
        showColumnMenu: true,
        rowHeight: 40,
        enableCellSelection: true,
        enableColumnResize: true,
        enableRowSelection: false,
        enableCellEditOnFocus: true,
        showSelectionCheckbox: true,
        selectWithCheckboxOnly: true,
        selectedItems: $scope.selectedResources,
        showFooter: true,
        columnDefs: [{field: 'name', displayName: 'Name', enableCellEdit: true}, 
                     {field:'email', displayName:'Email', enableCellEdit: true},
                     {field:'type', displayName:'Type', enableCellEdit: true},
                     {field:'cost', displayName:'Cost', enableCellEdit: true},
                     {field: 'remove', displayName:'', cellTemplate: removeResourceTemplate, enableCellEdit: false}]};

   $scope.addResource = function() {
    $scope.resourceGridData.push({});
  };

   $scope.removeResource = function() {
                    var index = this.row.rowIndex;
                    $scope.resourceGridOptions.selectItem(index, false);
                    $scope.resourceGridData.splice(index, 1);
                }


//Task Grid

 $scope.taskGridData = [{}];

 /*[{name: "Moroni", duration: 50, start: "4/14/16", end:"4/24/16", resources:"Pandey, Saumil"},
                      {name: "Moronir", duration: 50, start: "4/14/16", end:"4/24/16", resources: "Gaurav, Jalaj"}];
*/

    $scope.taskGridOptions= { 
      data: 'taskGridData' ,
     showFilter: true,
        showColumnMenu: true,
          rowHeight: 40,
        enableCellSelection: true,
        enableColumnResize: true,
        enableRowSelection: false,
        enableCellEditOnFocus: true,
        showSelectionCheckbox: true,
        selectWithCheckboxOnly: true,
        selectedItems: $scope.selectedTasks,
        showFooter: true,
        columnDefs: [{field: 'name', displayName: 'Name', enableCellEdit: true},
                     {field:'start', displayName:'Start', cellTemplate: startDateTemplate, enableCellEdit: false, width:'250px'},
                     {field:'end', displayName:'End', cellTemplate: endDateTemplate, enableCellEdit: false, width:'250px'},
                     {field:'duration', displayName:'Duration (In days)', enableCellEdit: false},
                     {field:'resources', displayName:'Resources', enableCellEdit: true}, //, cellFilter: 'resourceFilter'},
                     {field: 'progress', displayName:'Progress', cellTemplate: progressBarTemplate, enableCellEdit: false},
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





angular.module('app').controller('saveModalCtrl', function ($scope, $modalInstance, projectName) {

  //$scope.projectName = projectName;
 /* $scope.selected = {
    item: $scope.items[0]
  };
*/
  $scope.ok = function () {
    $modalInstance.close($scope.projectName);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
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

