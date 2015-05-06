// Code goes here
var myApp = angular.module('app',['ui.bootstrap', 'ngGrid', 'ui.bootstrap.datetimepicker','angular-svg-round-progress']);

var removeTaskTemplate = '<div style="text-align:center; vertical-align: middle"><input style="text-align:center; vertical-align: middle" type="button" class = "btn btn-mini btn-danger" value="remove" ng-click="removeTask($index)" /></div>';
var removeResourceTemplate = '<div style="text-align:center; vertical-align: middle"><input style="text-align:center; vertical-align: middle" type="button" class = "btn btn-mini btn-danger" value="remove" ng-click="removeResource($index)" /></div>';
var startDateTemplate = '<div class="dropdown"><a class="dropdown-toggle" id="dropdown1" role="button" data-toggle="dropdown" data-target="#" href="#"><div class="input-group"><input type="text" class="form-control" data-ng-model="row.entity.start"><span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span></div></a><ul class="dropdown-menu" role="menu" aria-labelledby="dLabel"><datetimepicker data-on-set-time="onStartTimeSet(newDate, oldDate, row.entity)" data-ng-model="data.startDate" data-datetimepicker-config="{ dropdownSelector: \'#dropdown1\' }"/></ul></div>';
var endDateTemplate = '<div class="dropdown"><a class="dropdown-toggle" id="dropdown2" role="button" data-toggle="dropdown" data-target="#" href="#"><div class="input-group"><input type="text" class="form-control" data-ng-model="row.entity.end"><span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span></div></a><ul class="dropdown-menu" role="menu" aria-labelledby="dLabel"><datetimepicker data-on-set-time="onEndTimeSet(newDate, oldDate, row.entity)" data-ng-model="data.endDate" data-datetimepicker-config="{ dropdownSelector: \'#dropdown2\' }"/></ul></div>';
var progressBarTemplate = '<progressbar class="progress-striped active" value="row.entity.progress" type="success"><b>{{row.entity.progress}}%</b></progressbar>';

myApp.controller('mainCtrl', function($scope, $http, $modal, $log, $location){

  var url = JSON.stringify($location.absUrl());
var index = url.indexOf("=");
$scope.user_id = url.substring(index+1,url.length-1);


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
  if(startDate > currentDate){
 entity.progress = 0;
}
else if (endDate < currentDate ){
  entity.progress = 100;
  setProjectProgress();
}
else{
  entity.progress = parseInt(((Math.round(Math.abs((startDate.getTime() - currentDate.getTime())/(oneDay)))/entity.duration)*100));
setProjectProgress();
}
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
if(startDate > currentDate){
 entity.progress = 0;
}
else if (endDate < currentDate ){
  entity.progress = 100;
  setProjectProgress();
}
else{
  entity.progress = parseInt(((Math.round(Math.abs((startDate.getTime() - currentDate.getTime())/(oneDay)))/entity.duration)*100));
setProjectProgress();
}

}
}

var setProjectProgress = function(){
  var projectProgress=0;

  for(i=0;i<$scope.taskGridData.length;i++){
projectProgress+=  parseInt($scope.taskGridData[i].progress);
  }
  $scope.projectProgress = parseInt(projectProgress/$scope.taskGridData.length);
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
       $scope.projectProgress = "";
    } else {
       
    }
  }

  $scope.openProject= function(){

$http({
url: 'http://localhost:8080/api/openProject/'+$scope.user_id,
method: 'GET'
//headers: {'Content-Type': 'application/json'}
}).success(function(data, status, headers, config){ 
//console.log(JSON.stringify(data));

var projects = data.projects;
var newProjects =[];
for(i=0;i<projects.length;i++){
var project_type = projects[i].project_type;
  if(typeof project_type != 'undefined' && project_type.toLowerCase() == "waterfall"){
  var newProject ={};
  newProject.project_id = projects[i].project_id;
  newProject.project_name = projects[i].project_name;
  newProject.project_type = projects[i].project_type;
  newProject.resources = projects[i].resources;
  newProject.projectProgress = projects[i].projectProgress;
  newProject.extendedFields = projects[i].extendedFields;

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
    newTask.extendedRows = tasks[j].extendedRows;
    newTasks.push(newTask);
  }
newProject.tasks = newTasks;
newProjects.push(newProject);
}
}

//$scope.projects = data.projects; //Getting all the projects

$scope.projects = newProjects;
$scope.items =[];
for (i = 0; i < $scope.projects.length; i++) {
$scope.items.push($scope.projects[i].project_name);
}
open('sm');

}).
error(function(data, status, headers, config) {
});
    };

var saveProject = function(Username, projectName){
  var newTasks = [];

 
for(i=0; i<$scope.taskGridData.length;i++){
 var newTask ={};
 newTask.project_id = $scope.taskGridData[i].project_id;
    newTask.task_id = $scope.taskGridData[i].task_id;
    newTask.name = $scope.taskGridData[i].name;
    newTask.duration = $scope.taskGridData[i].duration;
    newTask.start = new Date($scope.taskGridData[i].start);
    newTask.end = new Date($scope.taskGridData[i].end);
    newTask.progress = $scope.taskGridData[i].progress;
    newTask.resources = $scope.taskGridData[i].resources;
 
   var extendedRows = [];
 for(j=0;j<$scope.additionalColumnDefs.length;j++){

  var row ={};
  var tempField = $scope.additionalColumnDefs[j].field;
   row.field = tempField;
   tempRow = $scope.taskGridData[i];
   row.value = tempRow[tempField];
   extendedRows.push(row);
 }
    newTask.extendedRows = extendedRows;
    newTasks.push(newTask);
 
}
 //alert('newTasks '+JSON.stringify(newTasks));
//alert(JSON.stringify($scope.taskGridData));
var user = {
username:Username,
project:{
  project_name:projectName,
  project_type:"waterfall",
  extendedFields: $scope.additionalColumnDefs,
  projectProgress:$scope.projectProgress,
  tasks: newTasks,
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

$scope.additionalColumnDefs = [];

$scope.taskColumnDefs = [];

for(i=0;i<$scope.tempTaskColumnDefs.length;i++){
$scope.taskColumnDefs.push($scope.tempTaskColumnDefs[i]);
}

for(i=0;i<projects.length;i++){

if(projects[i].project_name == selectedItem){

for(j=0;j<projects[i].extendedFields.length;j++){
  $scope.additionalColumnDefs.push(projects[i].extendedFields[j]);
  
$scope.taskColumnDefs.splice($scope.taskColumnDefs.length-2, 0, projects[i].extendedFields[j]);

} 

var tasks = projects[i].tasks;
var newTasks =[];



for(k=0; k<tasks.length;k++){
  var task ={};
task.project_id = tasks[k].project_id;
task.task_id = tasks[k].task_id;
task.name = tasks[k].name;
task.desc = tasks[k].desc;
task.type = tasks[k].type;
task.duration = tasks[k].duration;
task.start = tasks[k].start;
task.end = tasks[k].end;
task.progress = tasks[k].progress;
task.resources = tasks[k].resources;
task.start = tasks[k].start;

for(j=0;j<projects[i].extendedFields.length;j++){
var temTask = tasks[k];
var extendedRows = temTask.extendedRows;

for(l=0;l<extendedRows.length;l++){
  if(projects[i].extendedFields[j].field == extendedRows[l].field){
  task[projects[i].extendedFields[j].field] = extendedRows[l].value;
break;
}
}
//alert(temTask[projects[i].extendedFields[j].field]);
//task[projects[i].extendedFields[j].field] = temTask[projects[i].extendedFields[j].field];
} 


newTasks.push(task);

}

//$scope.taskGridData = projects[i].tasks;
$scope.taskGridData = newTasks;
$scope.resourceGridData = projects[i].resources;
$scope.projectProgress = projects[i].projectProgress;
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
$scope.addField = function (size) {


    var modalInstance = $modal.open({
      templateUrl: 'addFieldModalContent.html',
      controller: 'addFieldModalCtrl',
      size: size,
      resolve: {
       
      taskColumnDefs: function () {
          return $scope.taskColumnDefs;
        },
        additionalColumnDefs: function () {
          return $scope.additionalColumnDefs;
        }
      }
    });

    modalInstance.result.then(function (taskColumnDefs) {
   

    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

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
      saveProject($scope.user_id,projectName);

     // alert("Done");
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

//Save confirm Box end

//Project Status Box start
$scope.projStats = function (size) {


    var modalInstance = $modal.open({
      templateUrl: 'projStatsModalContent.html',
      controller: 'projStatsModalCtrl',
      size: size,
      resolve: {
        projectProgress: function () {
          return $scope.projectProgress;
        }
      }
    });

    modalInstance.result.then(function () {

     // alert("Done");
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
//Project Status Box end

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
        //showSelectionCheckbox: true,
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

 $scope.tempTaskColumnDefs = [{field: 'name', displayName: 'Name', enableCellEdit: true},
                     {field:'start', displayName:'Start', cellTemplate: startDateTemplate, enableCellEdit: false, width:'250px'},
                     {field:'end', displayName:'End', cellTemplate: endDateTemplate, enableCellEdit: false, width:'250px'},
                     {field:'duration', displayName:'Duration (In days)', enableCellEdit: false},
                     {field:'resources', displayName:'Resources', enableCellEdit: true}, //, cellFilter: 'resourceFilter'},
                     {field: 'progress', displayName:'Progress', cellTemplate: progressBarTemplate, enableCellEdit: false},
                     {field: 'remove', displayName:'', cellTemplate: removeTaskTemplate, addField: false}];
 $scope.taskColumnDefs = $scope.tempTaskColumnDefs;

$scope.additionalColumnDefs =[];


    $scope.taskGridOptions= { 
      data: 'taskGridData' ,
     showFilter: true,
        showColumnMenu: true,
          rowHeight: 40,
        enableCellSelection: true,
        enableColumnResize: true,
        enableRowSelection: false,
        enableCellEditOnFocus: true,
        //showSelectionCheckbox: true,
        selectWithCheckboxOnly: true,
        selectedItems: $scope.selectedTasks,
        showFooter: true,
        columnDefs: 'taskColumnDefs'};

 $scope.addTask = function() {
    $scope.taskGridData.push({});
  };

   $scope.removeTask = function() {
                    var index = this.row.rowIndex;
                    $scope.taskGridOptions.selectItem(index, false);
                    $scope.taskGridData.splice(index, 1);
                };

});


angular.module('app').controller('saveModalCtrl', function ($scope, $modalInstance, projectName) {

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

angular.module('app').controller('projStatsModalCtrl', function ($scope, $modalInstance, projectProgress) {

$scope.projectProgress = projectProgress;
  $scope.ok = function () {
    $modalInstance.close($scope.projectProgress);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

angular.module('app').controller('addFieldModalCtrl', function ($scope, $modalInstance, taskColumnDefs, additionalColumnDefs) {

  $scope.ok = function () {
   var newColumn = {};
    newColumn.field = $scope.fieldName;
    newColumn.displayName = $scope.fieldName;
    newColumn.enableCellEdit = $scope.enableCellEdit;
    taskColumnDefs.splice(taskColumnDefs.length-2, 0, newColumn);
    additionalColumnDefs.push(newColumn); // For Multi-Tenancy
    $modalInstance.close(taskColumnDefs);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

