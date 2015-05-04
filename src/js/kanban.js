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
  $scope.list1 = [{'name':'Task1', 'desc':'Description', 'deadline':'Fri May 01 2015 15:43:12 GMT-0700 (PDT)', 'type':'Bug', 'progress': 0, 'drag': true},
   ];
  $scope.list2 = [{'name':'Task2', 'desc':'Description', 'deadline':'Fri May 01 2015 15:43:12 GMT-0700 (PDT)', 'type':'Bug', 'progress':'In Progress', 'drag': true}];
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
newTask.name = $scope.taskName;
newTask.desc = $scope.desc;
newTask.deadline = $scope.deadline;
if(typeof $scope.task.selected != 'undefined')
newTask.type = JSON.stringify($scope.task.selected.name);
newTask.assignee =$scope.assignee;
if(typeof $scope.status.selected != 'undefined')
newTask.progress = JSON.stringify($scope.status.selected.name);
newTask.drag = true;


   if(newTask.progress == '"Requested"')
    $scope.list1.push(newTask);
  else if(newTask.progress == '"In Progress"')
    $scope.list2.push(newTask);
  else if(newTask.progress == '"Done"')
    $scope.list3.push(newTask);
  else
    alert("Please select Task Status");
  

    $modalInstance.close($scope.projectName);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});