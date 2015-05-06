// Code goes here
var myApp = angular.module('app',['ui.bootstrap', 'ngGrid', 'ui.bootstrap.datetimepicker']);
var removeSprintTemplate = '<div style="text-align:center; vertical-align: middle"><input style="text-align:center; vertical-align: middle" type="button" class = "btn btn-mini btn-danger" value="remove" ng-click="removeSprint($index)" /></div>';
var removeStoryTemplate = '<div style="text-align:center; vertical-align: middle"><input style="text-align:center; vertical-align: middle" type="button" class = "btn btn-mini btn-danger" value="remove" ng-click="removeStory($index)" /></div>';
var displayTemplate = '<div style="text-align:center; vertical-align: middle"><input style="text-align:center; vertical-align: middle" type="button" class = "btn btn-mini btn-default" value="Stories" ng-click="displaySprintTasks($index)" /></div>';
var startDateTemplate = '<div class="dropdown"><a class="dropdown-toggle" id="dropdown1" role="button" data-toggle="dropdown" data-target="#" href="#"><div class="input-group"><input type="text" class="form-control" data-ng-model="row.entity.start"><span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span></div></a><ul class="dropdown-menu" role="menu" aria-labelledby="dLabel"><datetimepicker data-on-set-time="onStartTimeSet(newDate, oldDate, row.entity)" data-ng-model="data.startDate" data-datetimepicker-config="{ dropdownSelector: \'#dropdown1\' }"/></ul></div>';
var endDateTemplate = '<div class="dropdown"><a class="dropdown-toggle" id="dropdown2" role="button" data-toggle="dropdown" data-target="#" href="#"><div class="input-group"><input type="text" class="form-control" data-ng-model="row.entity.end"><span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span></div></a><ul class="dropdown-menu" role="menu" aria-labelledby="dLabel"><datetimepicker data-on-set-time="onEndTimeSet(newDate, oldDate, row.entity)" data-ng-model="data.endDate" data-datetimepicker-config="{ dropdownSelector: \'#dropdown2\' }"/></ul></div>';
var progressBarTemplate = '<progressbar animate="false" value="row.entity.progress" type="success"><b>{{row.entity.progress}}%</b></progressbar>';
var addSprintTemplate = '<div style="text-align:center; vertical-align: middle"><input style="text-align:center; vertical-align: middle" type="button" class = "btn btn-mini btn-default" value="ADD TO SPRINT" ng-click="displayData($index)" /></div>';

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
            $scope.sprintGridData = [{}];
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
                var project_type = projects[i].project_type;
            if(typeof project_type != 'undefined' && project_type.toLowerCase() == "scrum"){
                var newProject ={};
                newProject.project_id = projects[i].project_id;
                newProject.project_name = projects[i].project_name;
                newProject.project_type = projects[i].project_type;
                newProject.resources = projects[i].resources;
                var sprints = projects[i].sprints;
                var newSprints = [];

                for(j=0;j<sprints.length;j++){
                    var newSprint ={};
                    newSprint.project_id = sprints[j].project_id;
                    newSprint.sprint_id = sprints[j].sprint_id;
                    newSprint.name = sprints[j].name;
                    newSprint.duration = sprints[j].duration;
                    newSprint.start = new Date(sprints[j].start);
                    newSprint.end = new Date(sprints[j].end);
                    newSprint.progress = sprints[j].progress;
                    newSprint.tasks = sprints[j].tasks;
                    newSprints.push(newSprint);
                }
                newProject.sprints = newSprints;
                newProjects.push(newProject);
                }

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
                project_type:'scrum',
                sprints: $scope.sprintGridData
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
                    $scope.sprintGridData = projects[i].sprints;
                    break;
                }

            }
           
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

        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

//Save confirm Box end

// Grid

    $scope.sprintGridData = [{}];

    $scope.sprintGridOptions= {
        data: 'sprintGridData' ,
        showFilter: true,
        showColumnMenu: true,
        rowHeight: 40,
        enableCellSelection: true,
        enableColumnResize: true,
        enableRowSelection: false,
        enableCellEditOnFocus: true,
        showSelectionCheckbox: true,
        selectWithCheckboxOnly: true,
        selectedItems: $scope.selectedSprints,
        showFooter: true,
        columnDefs: [{field: 'name', displayName: 'Name', enableCellEdit: true},
            {
                field: 'start',
                displayName: 'Start',
                cellTemplate: startDateTemplate,
                enableCellEdit: false,
                width: '250px'
            },
            {field: 'end', displayName: 'End', cellTemplate: endDateTemplate, enableCellEdit: false, width: '250px'},
            {field: 'duration', displayName: 'Duration (In days)', enableCellEdit: false},
            {field: 'display', displayName:'', cellTemplate: displayTemplate, enableCellEdit: false},
            {field: 'remove', displayName:'', cellTemplate: removeSprintTemplate, enableCellEdit: false}
        ]};


    $scope.addSprint = function() {
        $scope.setActiveTab(1); //If user is in different tab
        $scope.sprintGridData.push({});
    };

    $scope.removeSprint = function() {
        var index = this.row.rowIndex;
        $scope.sprintGridOptions.selectItem(index, false);
        $scope.sprintGridData.splice(index, 1);
    };



    $scope.displaySprintTasks = function() {

    var index = this.row.rowIndex;
$scope.currentSprintIndex =index;
$scope.storyGridColumnDefs = [];
$scope.additionalColumnDefs = [];
$scope.taskColumnDefs = [];

for(i=0;i<$scope.tempStoryGridColumnDefs.length;i++){
$scope.storyGridColumnDefs.push($scope.tempStoryGridColumnDefs[i]);
}

for(i=1;i<=$scope.sprintGridData[index].duration;i++){
    var newColumn = {};
    newColumn.field = "day"+i;
    newColumn.displayName = "Day"+i;
    newColumn.enableCellEdit = true;
    $scope.storyGridColumnDefs.splice($scope.storyGridColumnDefs.length-1, 0, newColumn);
    $scope.additionalColumnDefs.push(newColumn);
}

var stories = $scope.sprintGridData[index].tasks;


if(typeof stories != 'undefined'){
    $scope.storyGridData = []; //Clear all stories
for(i=0;i<stories.length;i++){
var newStory = {};
newStory.name = stories[i].name;
newStory.initial_estimate = stories[i].desc;
var extendedRows = stories[i].extendedRows;
for(j=0;j<extendedRows.length;j++){
    for(k=0;k<$scope.additionalColumnDefs.length;k++){
        var tempColumn = $scope.additionalColumnDefs[k];

        if(extendedRows[j].field == tempColumn.field){
           newStory[tempColumn.field] =  extendedRows[j].value;
           break;
        }
    }
}
$scope.storyGridData.push(newStory);

}
}

else
    $scope.storyGridData = [{}];


$scope.setActiveTab(2);

       
    };

$scope.tempStoryGridColumnDefs = [
            {field: 'name', displayName: 'Story Name', enableCellEdit: true},
            {field:'initial_estimate', displayName:'Initial Estimate', enableCellEdit: true},
            {field: 'remove', displayName:'', cellTemplate: removeStoryTemplate, enableCellEdit: false}
        ];
    $scope.storyGridColumnDefs = $scope.tempStoryGridColumnDefs;    
    $scope.additionalColumnDefd = [];
  // grid to store the StoryData
    $scope.storyGridData = [{}];

    $scope.storyGridOptions= {
        data: 'storyGridData' ,
        showFilter: true,
        showColumnMenu: true,
        rowHeight: 40,
        enableCellSelection: true,
        enableColumnResize: true,
        enableRowSelection: false,
        enableCellEditOnFocus: true,
        //showSelectionCheckbox: true,
        selectWithCheckboxOnly: true,
        selectedItems: $scope.selectedSprints,
        showFooter: true,
        columnDefs: 'storyGridColumnDefs'};

 $scope.saveSprint = function() {
      
var tasks = [];
for(i=0;i<$scope.storyGridData.length;i++){
var task = {};
var extendedRows = [];
var story = $scope.storyGridData[i];
  var storyKeys = Object.keys(story);

for(j=0;j<storyKeys.length;j++){
    if(storyKeys[j] == 'name')
        task.name = $scope.storyGridData[i].name;
    else if(storyKeys[j] == 'initial_estimate')
     task.desc = story.initial_estimate;
    else{
        newRow = {};
        key = storyKeys[j]
        newRow.field = key;
        newRow.value = story[key];
        extendedRows.push(newRow);
    }
}
task.extendedRows = extendedRows;
tasks.push(task);
$scope.sprintGridData[$scope.currentSprintIndex].tasks = tasks;
alert("Sprint details saved");
$scope.setActiveTab(1); // Back to sprint tab
}

Object.keys($scope.storyGridData[0]);

    };

    $scope.addStory = function() {
        $scope.storyGridData.push({});
    };

    $scope.removeStory = function() {
        var index = this.row.rowIndex;
        $scope.storyGridOptions.selectItem(index, false);
        $scope.storyGridData.splice(index, 1);
    };

    $scope.displayCharts = function () {
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'burndownChart'
            },
            title: {
                text: 'Burndown Chart',
                x: 0 //center
            },
            colors: ['blue', 'red'],
            plotOptions: {
                line: {
                    lineWidth: 3
                },
                tooltip: {
                    hideDelay: 200
                }
            },
            subtitle: {
                text: 'Sprint 1',
                x: 0
            },
            xAxis: {
                categories: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5']
            },
            yAxis: {
                title: {
                    text: 'Hours'
                },
                plotLines: [{
                    value: 0,
                    width: 1
                }]
            },
            tooltip: {
                valueSuffix: ' hrs',
                crosshairs: true,
                shared: true
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: 'Ideal Burn',
                color: 'rgba(255,0,0,0.25)',
                lineWidth: 2,
                data: [40, 30, 20, 10, 5, 8, 10 ,12 ,15, 25,40,30]
            }, {
                name: 'Actual Burn',
                color: 'rgba(0,120,200,0.75)',
                marker: {
                    radius: 6
                },
                data: [30, 10, 20, 10, 0, 8, 6 ,6 ,10, 25,20,12]
            }]
        });
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

/**
 * Created by saumil113 on 5/4/2015.
 */
