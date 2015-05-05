var App = angular.module('app', ['ngDragDrop','ngSanitize', 'ui.select','ui.bootstrap', 'ui.bootstrap.datetimepicker']);

App.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  }
});

App.controller('kanbanCtrl', function($scope, $timeout, $http, $modal, $log) {
  $scope.list1 = [
 // {'id':1, 'name':'Task1', 'desc':'Description', 'deadline':'Fri May 01 2015 15:43:12 GMT-0700 (PDT)', 'type':'Bug Fix', 'assignee':'Gaurav Bajaj','progress': 'Requested', 'drag': true},
   ];
  $scope.list2 = [
 // {'id':2,'name':'Task2', 'desc':'Description', 'deadline':'Fri May 01 2015 15:43:12 GMT-0700 (PDT)', 'type':'Feature Request', 'assignee':'Gaurav Bajaj','progress':'In Progress', 'drag': true}
  ];
  $scope.list3 = [];

  // Limit items to be dropped in list1
  
  /*$scope.optionsList1 = {
    accept: function(dragEl) {
      if ($scope.list1.length >= 2) {
        return false;
      } else {
        return true;
      }
    }
  };
*/


  $scope.task = {};
  $scope.taskTypes = [{ name: 'Bug Fix'},{ name: 'Feature Request'},{ name: 'Support Request'}];

  $scope.status = {};
  $scope.Statuses = [{ name: 'Requested'},{ name: 'In Progress'},{ name: 'Done'}];

$scope.newProject = function(){
    if (confirm("Have you saved your current Project?") == true) {
       $scope.list1 = [{}];
       $scope.list2 = [{}];
       $scope.list3 = [{}];
    } else {
       
    }
  }
var saveProject = function(Username, projectName){
 
var kanbanTasks = [];

for(i=0;i<$scope.list1.length;i++){
var newTask ={};
newTask.task_id = $scope.list1[i].id;
newTask.name = $scope.list1[i].name;
newTask.desc = $scope.list1[i].desc;
newTask.type = $scope.list1[i].type;
newTask.end = $scope.list1[i].deadline;
newTask.progress = 'Requested';
var resources = [];
resources.push($scope.list1[i].assignee);
newTask.resources = resources;
kanbanTasks.push(newTask);
}

for(i=0;i<$scope.list2.length;i++){
var newTask ={};
newTask.task_id = $scope.list2[i].id;
newTask.name = $scope.list2[i].name;
newTask.desc = $scope.list2[i].desc;
newTask.type = $scope.list2[i].type;
newTask.end = $scope.list2[i].deadline;
newTask.progress = 'In Progress';
var resources = [];
resources.push($scope.list2[i].assignee);
newTask.resources = resources;
kanbanTasks.push(newTask);
}

for(i=0;i<$scope.list3.length;i++){
var newTask ={};
newTask.task_id = $scope.list3[i].id;
newTask.name = $scope.list3[i].name;
newTask.desc = $scope.list3[i].desc;
newTask.type = $scope.list3[i].type;
newTask.end = $scope.list3[i].deadline;
newTask.progress = 'Done';
var resources = [];
resources.push($scope.list3[i].assignee);
newTask.resources = resources;
kanbanTasks.push(newTask);
}


var user = {
username:Username,
project:{
  project_name:projectName,
  project_type:"kanban",
  //projectProgress:$scope.projectProgress,
  tasks: kanbanTasks,
  //resources:$scope.resourceGridData
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

//Open project
$scope.openProject= function(){

$http({
url: 'http://localhost:8080/api/openProject/goru97',
method: 'GET'
//headers: {'Content-Type': 'application/json'}
}).success(function(data, status, headers, config){ 

var projects = data.projects;
var newProjects =[];
for(i=0;i<projects.length;i++){
var project_type = projects[i].project_type;
  if(typeof project_type != 'undefined' && project_type.toLowerCase() == "kanban"){
  var newProject ={};
  newProject.project_id = projects[i].project_id;
  newProject.project_name = projects[i].project_name;
  newProject.project_type = projects[i].project_type;

var tasks = projects[i].tasks;
  var newTasks = [];

  for(j=0;j<tasks.length;j++){
    var newTask ={};
    newTask.project_id = tasks[j].project_id;
    newTask.id = tasks[j].task_id;
    newTask.name = tasks[j].name;
    newTask.desc = tasks[j].desc;
    newTask.deadline = new Date(tasks[j].end);
    newTask.type = tasks[j].type;
    newTask.assignee = tasks[j].resources[0];
    newTask.progress = tasks[j].progress;
    newTask.drag = true;
    newTasks.push(newTask);
  }
newProject.tasks = newTasks;
newProjects.push(newProject);
}
}


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

    //Open Modal starts here

$scope.items = [];

 var open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'openModalContent.html',
      controller: 'OpenModalInstanceCtrl',
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
$scope.taskData = projects[i].tasks;
break;
}
}
$scope.list1 = [];
$scope.list2 = [];
$scope.list3 = [];

for(i=0;i<$scope.taskData.length;i++){
  var newTask = $scope.taskData[i];
    if(newTask.progress == 'Requested')
      $scope.list1.push(newTask);
    else if(newTask.progress == 'In Progress')
      $scope.list2.push(newTask);
    else if(newTask.progress == 'Done')
      $scope.list3.push(newTask);

}
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
      saveProject("goru97",projectName);

     // alert("Done");
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  //Add task Box start
$scope.addTask = function (size) {


    var modalInstance = $modal.open({
      templateUrl: 'addTaskModalContent.html',
      controller: 'addTaskModalCtrl',
      size: size,
      resolve: {
        taskData: function () {
          var taskData = {};
          taskData.taskTypes = $scope.taskTypes;
          taskData.task = $scope.task;
          taskData.Statuses = $scope.Statuses;
          taskData.status = $scope.status;
          taskData.taskName = $scope.taskName;
          taskData.desc = $scope.desc;
          taskData.assignee = $scope.assignee;
          taskData.deadline = $scope.deadline;
          taskData.list1 = $scope.list1;
          taskData.list2 = $scope.list2;
          taskData.list3 = $scope.list3;
 
          return taskData;
        }
      }
    });

    modalInstance.result.then(function (taskData) {
     // saveProject("goru97",projectName);

     // alert("Done");
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  //Add task Box start
var modifyTask = function (size, item) {


    var modalInstance = $modal.open({
      templateUrl: 'modifyTaskModalContent.html',
      controller: 'modifyTaskModalCtrl',
      size: size,
      resolve: {
        taskData: function () {
          var taskData = {};
          taskData.taskTypes = $scope.taskTypes;
          taskData.task = $scope.task;
          taskData.Statuses = $scope.Statuses;
          taskData.status = $scope.status;
          taskData.taskName = item.name;
          taskData.id = item.id;
          taskData.desc = item.desc;
          taskData.assignee = item.assignee;
          taskData.deadline = item.deadline;
          taskData.list1 = $scope.list1;
          taskData.list2 = $scope.list2;
          taskData.list3 = $scope.list3;
 
          return taskData;
        }
      }
    });

    modalInstance.result.then(function (taskData) {
     // saveProject("goru97",projectName);

     // alert("Done");
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };


$scope.openTaskData = function(item){

modifyTask('sm',item);

}

$scope.deleteTask = function(item,listId){
//alert(listId+JSON.stringify(item));

var r = confirm("Are you sure you want to delete this task?");
if (r == true) {
   if(listId == 1){
  for(i=0;i<$scope.list1.length;i++){
    if($scope.list1[i].id == item.id){
$scope.list1.splice(i, 1);
break;
    }
  }
}
else if(listId == 2){
  for(i=0;i<$scope.list2.length;i++){
    if($scope.list2[i].id == item.id){
$scope.list2.splice(i, 1);
break;
    }
  }
}
else if(listId == 3){
  for(i=0;i<$scope.list3.length;i++){
    if($scope.list3[i].id == item.id){
$scope.list3.splice(i, 1);
break;
    }
  }
}
} else {
   
}


}


//For Tasks

  $scope.clear = function() {
    $scope.task.selected = undefined;

  };


});

angular.module('app').controller('addTaskModalCtrl', function ($scope, $modalInstance, taskData) {
$scope.taskTypes = taskData.taskTypes;
$scope.task = taskData.task;
$scope.Statuses = taskData.Statuses;
$scope.status = taskData.status;
$scope.taskName = taskData.taskName;
$scope.desc = taskData.desc;
$scope.assignee = taskData.assignee;
$scope.taskName = taskData.taskName;
$scope.deadline = taskData.deadline;
$scope.list1 = taskData.list1;
$scope.list2 = taskData.list2;
$scope.list3 = taskData.list3;

$scope.ok = function () {
var newTask = {};
var id = Math.floor(Math.random() * (10000 - 1 + 1)) + 1;

newTask.name = $scope.taskName;
newTask.id = id;
newTask.desc = $scope.desc;
newTask.deadline = $scope.deadline;
if(typeof $scope.task.selected != 'undefined')
newTask.type = JSON.stringify($scope.task.selected.name);
newTask.assignee =$scope.assignee;
if(typeof $scope.status.selected != 'undefined'){
  var progress = JSON.stringify($scope.status.selected.name);
  progress = progress.substring(1,progress.length-1);
newTask.progress = progress;

}
newTask.drag = true;

var existing = false;

for(i=0;i<$scope.list1.length;i++){
   if($scope.list1[i].name.toLowerCase() == newTask.name.toLowerCase()){
    existing = true;
    break;
   }
}
if(!existing) 
for(i=0;i<$scope.list2.length;i++){
   if($scope.list2[i].name.toLowerCase() == newTask.name.toLowerCase()){
    existing = true;
    break;
   }
}; 
if(!existing)  
for(i=0;i<$scope.list3.length;i++){
   if($scope.list3[i].name.toLowerCase() == newTask.name.toLowerCase()){
    existing = true;
    break;
   }
};  
   if(newTask.progress == 'Requested'){ 
    if(!existing) 
    $scope.list1.push(newTask);
   else
    alert("Task already exists; Please enter a new name");
  }
  else if(newTask.progress == 'In Progress'){
    if(!existing) 
    $scope.list2.push(newTask);
  else
     alert("Task already exists; Please enter a new name");
  }
  else if(newTask.progress == 'Done'){
   if(!existing) 
    $scope.list3.push(newTask);
  else
     alert("Task already exists; Please enter a new name");
  }
  else
    alert("Please select Task Status");
  
    $modalInstance.close($scope.projectName);

  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


//Display Or Modify

angular.module('app').controller('modifyTaskModalCtrl', function ($scope, $modalInstance, taskData) {
$scope.taskTypes = taskData.taskTypes;
$scope.task = taskData.task;
$scope.Statuses = taskData.Statuses;
$scope.status = taskData.status;
$scope.taskName = taskData.taskName;
$scope.desc = taskData.desc;
$scope.assignee = taskData.assignee;
$scope.taskName = taskData.taskName;
$scope.deadline = taskData.deadline;
$scope.list1 = taskData.list1;
$scope.list2 = taskData.list2;
$scope.list3 = taskData.list3;

$scope.ok = function () {

var updated = false;


for(i=0;i<$scope.list1.length;i++){
   if($scope.list1[i].id == taskData.id){

$scope.list1[i].name = $scope.taskName;
$scope.list1[i].desc = $scope.desc;
$scope.list1[i].deadline = $scope.deadline;
if(typeof $scope.task.selected != 'undefined')
$scope.list1[i].type = JSON.stringify($scope.task.selected.name);
$scope.list1[i].assignee =$scope.assignee;
if(typeof $scope.status.selected != 'undefined')
$scope.list1[i].progress = JSON.stringify($scope.status.selected.name);
    break;
   }
}

if(!updated)
 for(i=0;i<$scope.list2.length;i++){

  
   if($scope.list2[i].id == taskData.id){
$scope.list2[i].name = $scope.taskName;
$scope.list2[i].desc = $scope.desc;
$scope.list2[i].deadline = $scope.deadline;
if(typeof $scope.task.selected != 'undefined')
$scope.list2[i].type = JSON.stringify($scope.task.selected.name);
$scope.list2[i].assignee =$scope.assignee;
if(typeof $scope.status.selected != 'undefined')
$scope.list2[i].progress = JSON.stringify($scope.status.selected.name);
    break;
   }
}

if(!updated)
 for(i=0;i<$scope.list3.length;i++){
   if($scope.list3[i].id == taskData.id){

$scope.list3[i].name = $scope.taskName;
$scope.list3[i].desc = $scope.desc;
$scope.list3[i].deadline = $scope.deadline;
if(typeof $scope.task.selected != 'undefined')
$scope.list3[i].type = JSON.stringify($scope.task.selected.name);
$scope.list3[i].assignee =$scope.assignee;
if(typeof $scope.status.selected != 'undefined')
$scope.list3[i].progress = JSON.stringify($scope.status.selected.name);
    break;
   }
}


  $modalInstance.close($scope.projectName);

  };





  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
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

angular.module('app').controller('OpenModalInstanceCtrl', function ($scope, $modalInstance, items) {

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
