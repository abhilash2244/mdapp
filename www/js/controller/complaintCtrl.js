angular.module('starter.controllers')
    .controller('complaintCtrl', function($scope, CONSTANTS, restServices, $rootScope, $ionicPopup, $timeout, $state, $ionicPopover, $localstorage, formsSave, commonService) {

        $ionicPopover.fromTemplateUrl('./templates/complaintsFilter.html', {
            scope: $scope,
        }).then(function(popover) {
            $scope.popoverFilter = popover;
        });
        $scope.closeFilter = function() {
            $scope.popoverFilter.hide();
        }
        $scope.openFilter = function(image) {
            // $scope.imgurl=image;
            $scope.popoverFilter.show();
            $scope.date = new Date();
            $scope.filter = {};
            $scope.filter.fromdate = new Date();
            $scope.filter.todate = new Date();
        }

        $scope.validLogin = function() {
            var loggedinas = $localstorage.get("X-Access-Token");
            if (loggedinas == undefined) {
                $state.go('login');
            }

        }

        //show gms popover list 

        $ionicPopover.fromTemplateUrl('./templates/gmlistpopover.html', {
            scope: $scope,
        }).then(function(popover) {
            $scope.popover = popover;
        });
        $scope.closeGm = function() {
                $scope.popover.hide();
            }
            //filter for record id by visitor id   
        function visitorid() {
            var visitorno = $scope.visitornoassign;
            for (var i = 0; i < $rootScope.completeRecords.length; i++) {
                if ($rootScope.completeRecords[i].TextBox__name_2006749 == visitorno) {
                    var selectedid = $rootScope.recordId[i];
                    $rootScope.asignrecd = selectedid;
                    var canInformation = $rootScope.completeRecords[i];
                    $scope.canInfo = canInformation;
                    $scope.recordInfoUploaded = $rootScope.recordInfo[i];
                    console.log($scope.recordInfoUploaded.UpdatedBy)
                }
            }
        }

        $scope.closeGm = function() {
            $scope.popover.hide();
        }
        $scope.showGm = function(id) {
            $scope.visitornoassign = id;
            visitorid();
            commonService.LoaderShow('pleasewait');
            var url = CONSTANTS.gmlist;
            var headers = restServices.getHeaders();
            var config = {};
            config.headers = headers;
            restServices.restGetType(url, config, function(status, res) {
                commonService.LoaderHide();
                $rootScope.totalUsers = res.data;
            });
            $scope.popover.show();
        }

        //popup on no data found
        $scope.showNoDataFound = function() {
            var alertPopup = $ionicPopup.alert({
                // title: 'Assigned ',
                template: 'No Data Found'
            });
        };

        //popup on assignment
        $scope.showPopupAssignment = function() {
            $scope.closeGm();
            var alertPopup = $ionicPopup.alert({
                // title: 'Assigned ',
                template: 'Assigned Successfully'
            });
            alertPopup.then(function(res) {
                console.log('assign success');
                $rootScope.getFilterredFroms();
            });
        };

        //assign to a user update by md
        $scope.submitAssignedUser = function(type) {
            $scope.canInfo.TextBox__name_1416992 = type;
            var obj = {};
            var arr = [];
            var securityHeaders = restServices.getHeaders();
            console.log(securityHeaders)
            console.log($scope.canInfo.TextBox__name_1416992)
            arr.push($scope.canInfo)
            obj.record = arr;
            obj.formId = $rootScope.formIdSelected;
            obj.taskId = $rootScope.taskIdSelected;
            obj.version = $rootScope.version;
            var datenow = new Date();
            var isoDate = datenow.toISOString();
            obj.updatedTime = isoDate;
            obj.updatedBy = $scope.recordInfoUploaded.UpdatedBy;
            obj.recordId = $rootScope.asignrecd;
            var url = CONSTANTS.mdupdate;
            obj.lat = $scope.lat;
            obj.long = $scope.long;
            var generatedId = Date.now();
            obj.generatedId = generatedId;
            console.log(obj)
            console.log(securityHeaders)
            commonService.LoaderShow('pleasewait');
            formsSave.saveForm(url, obj, securityHeaders, function(response) {
                commonService.LoaderHide();
                if (response.status == 200) {
                    // $scope.showPopupAssignment();
                }

            });
        }

        //md assign record to a gm; update record and assign 
        $scope.assignrecord2gm = function(user) {

            console.log(user)
                //assigned gm will be updated in the record
            $scope.canInfo.TextBox__name_1416992 = user;
            var obj = {};
            var arr = [];
            var securityHeaders = restServices.getHeaders();
            console.log(securityHeaders)
            console.log($scope.canInfo.TextBox__name_1416992)
            arr.push($scope.canInfo)
            obj.record = arr;
            obj.formId = $rootScope.formIdSelected;
            obj.taskId = $rootScope.taskIdSelected;
            obj.version = $rootScope.version;
            var datenow = new Date();
            var isoDate = datenow.toISOString();
            obj.updatedTime = isoDate;
            obj.updatedBy = $scope.recordInfoUploaded.UpdatedBy;
            obj.recordId = $rootScope.asignrecd;
            var url = CONSTANTS.mdupdate;
            obj.lat = $scope.lat;
            obj.long = $scope.long;
            var generatedId = Date.now();
            obj.generatedId = generatedId;
            console.log(obj)
            console.log(securityHeaders)
            commonService.LoaderShow('pleasewait');
            formsSave.saveForm(url, obj, securityHeaders, function(response) {
                commonService.LoaderHide();
                if (response.status == 200) {
                    var headers = restServices.getHeaders();
                    var config = {};
                    config.headers = headers;
                    var recordData = {},
                        recordCollection = [],
                        config = {};
                    $scope.reassignedfrom = "task";
                    $scope.commentRecords = "to be done fast"
                    $rootScope.taskkId = $rootScope.taskIdSelected;
                    recordData.formId = $rootScope.formIdSelected;
                    var id = $rootScope.asignrecd;
                    var reassignedRecordIds = [];
                    reassignedRecordIds.push(id);
                    recordData.assignedTo = user;
                    recordData.recordsId = reassignedRecordIds;
                    recordData.comments = $scope.commentRecords;
                    recordData.reassignedfrom = $scope.reassignedfrom;
                    var url = CONSTANTS.ReassignRecord;
                    console.log(recordData)
                    console.log(JSON.stringify(recordData))
                    commonService.LoaderShow('pleasewait');
                    restServices.restPostType(url, JSON.stringify(recordData), config, function(status, res) {
                        commonService.LoaderHide();
                        if (res.data.status == 200) {
                            $scope.showPopupAssignment();
                        }
                    });
                }

            })

            // $scope.$broadcast('show-error-event');
        }

        $rootScope.getFilterredFroms = function(user, fromdate, todate, where, dept) {
                commonService.LoaderShow('pleasewait');
                console.log($rootScope.fromdate)
                console.log($rootScope.todate)
                var url = CONSTANTS.getFormsRecords;
                var headers = restServices.getHeaders();
                var config = {};
                config.headers = headers;
                $rootScope.formIdSelected = CONSTANTS.formid;
                $rootScope.taskIdSelected = CONSTANTS.taskid;
                $scope.RecordValue = [];
                var formlistData = [];
                $scope.lableValidationField = [];
                $scope.resolelist = [];
                var widgetValuesList = [];
                var columnDefs = [];
                var sectionCategory = [];
                var groupCategory = [];
                var inserted = {};
                $rootScope.recordIdsList = [];
                $rootScope.SelectedRecordIds = [];
                $scope.formRecordsInfo = {};
                $scope.allRecords = {};
                $rootScope.reassignRecordIds = {};
                $scope.recordIdsList = [];
                var recordInsertedBy = [];
                var formDetailsForRecords = {};
                formDetailsForRecords['type'] = 0,
                    formDetailsForRecords['fromDate'] = $rootScope.fromdate,
                    formDetailsForRecords['toDate'] = $rootScope.todate,
                    formDetailsForRecords['formId'] = $rootScope.formIdSelected;
                // formDetailsForRecords['departmentId'] = ['All'],
                // formDetailsForRecords['users'] = "user"
                formDetailsForRecords['departmentId'] = ["All"],
                    formDetailsForRecords['users'] = "All"
                if ($scope.formlist == undefined) {
                    console.log(formDetailsForRecords)
                    restServices.restPostType(url, formDetailsForRecords, config, function(status, res) {
                        commonService.LoaderHide();
                        if (res.data.status == 204) {
                            $scope.showNoDataFound();
                        }
                        console.log(res)
                        console.log(status)
                        $rootScope.version = res.data.formInfo.version;
                        //console.log($localstorage.get("username"))
                        $rootScope.setOfComments = res.data.comments;
                        // console.log(res.data.comments)
                        $rootScope.completeRecords = res.data.records;
                        //console.log(res.data.records)
                        $rootScope.recordInfo = res.data.recordInfo;
                        // console.log(res.data.recordInfo)
                        $rootScope.reassignRecordIds = res.data.reassignRecordIds;
                        // console.log(res.data.reassignRecordIds)
                        $rootScope.recordId = res.data.recordIdsList;
                        // console.log(res.data.recordIdsList)
                        $rootScope.fields = res.data.Skelton;
                        // console.log(res.data.Skelton)
                    });
                }
            }
            //get complaints addressed on the same day on refresh 
        $rootScope.getFilterredFroms();
        $scope.getComplaints = function() {
            $scope.getFilterredFroms();
            $scope.$broadcast('scroll.refreshComplete');
        }

        $scope.getVisitorData = function(visitorId) {
                $rootScope.getVisitorDataId = visitorId;
            }
            //filtered complaints from date to date
        $scope.getComplaintsFilter = function(filter) {
            // console.log(filter)
            $rootScope.fromdate = filter.fromdate;
            $rootScope.todate = filter.todate;
            $scope.getFilterredFroms();
            $scope.closeFilter();
        }

        $scope.rep = [1, 2, 3, 4, 5, 6];
        var str = '18101';
        console.log(str.length)
        console.log(str.slice(-3)); // returns 'nu.' last two
        console.log(str.slice(3, -7)); // returns 'name is'
        console.log(str.slice(0, -1)); // returns 'my name is maanu'

        // document.getElementById("split").innerHTML = ""+split[0]+".00";
        function myFunction() {
            var str = document.getElementById("select").value;
            console.log(str)
            var res = str.split(" ", 3);
            document.getElementById("print").innerHTML = res;
        }
        // myFunction();
    })