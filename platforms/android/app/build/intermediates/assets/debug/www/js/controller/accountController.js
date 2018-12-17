angular.module('starter.controllers')
    .controller('AccountCtrl', function($scope, $localstorage, $state, $rootScope, $window, $ionicPopover, CONSTANTS, restServices, $cordovaToast) {
        //toast example
        // $scope.showToast = function(message, duration, location) {
        //         $cordovaToast.show(message, duration, location).then(function(success) {
        //             console.log("The toast was shown");
        //         }, function (error) {
        //             console.log("The toast was not shown due to " + error);
        //         });
        //     }

        //testing for visitor number
        $rootScope.getFilterredFromsCount = function(user, fromdate, todate, where, dept) {
            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            var d = new Date();
            var yearLast = new Date().getFullYear().toString().substr(-2);
            var monthFull = d.getMonth().toString().padStart(2, "0")
            var yearMonth = parseInt("" + yearLast + monthFull)
            var yearMonthNow = yearMonth + 1;
            var url = CONSTANTS.getFormsRecords;
            var headers = restServices.getHeaders();
            var config = {};
            config.headers = headers;
            $rootScope.formIdSelected = "93cecf4f0000000000000000";
            $rootScope.taskIdSelected = "93e0d7010000000000000000"
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

            formDetailsForRecords['type'] = 3,
                formDetailsForRecords['fromDate'] = firstDay,
                formDetailsForRecords['toDate'] = lastDay,
                formDetailsForRecords['formId'] = $rootScope.formIdSelected;
            formDetailsForRecords['departmentId'] = ['All'],
                formDetailsForRecords['users'] = "user"
            if ($scope.formlist == undefined) {

                restServices.restPostType(url, formDetailsForRecords, config, function(status, res) {
                    if (res.data.status == 204) {
                        console.log("no data found")
                    }
                    $rootScope.completeRecords = res.data.records;
                    var countVisitor = parseInt("" + yearMonthNow + res.data.records.length)
                    var visitorNo = countVisitor + 1
                    console.log(visitorNo)
                });
            }
        }

        //backto swttings
        $scope.backToSettings = function() {
                $state.go("tab.account")
            }
            //about us formsz.com
        $scope.aboutUs = function() {
            $state.transitionTo("aboutus");
        }

        //change password or firstlogin
        $scope.changePwd = function() {
            $rootScope.loggedAndChange = true;
            $state.transitionTo("changePassword");
        };
        //username
        $scope.user = $localstorage.get("username");
        console.log($localstorage.get("username"))

        //network abhilash 
        // document.getElementById("networkInfo").addEventListener("click", networkInfo);
        // document.addEventListener("offline", onOffline, false);
        // document.addEventListener("online", onOnline, false);

        function networkInfo() {
            var networkState = navigator.connection.type;
            var states = {};
            states[navigator.connection.UNKNOWN] = 'Unknown connection';
            states[navigator.connection.ETHERNET] = 'Ethernet connection';
            states[navigator.connection.WIFI] = 'WiFi connection';
            states[navigator.connection.CELL_2G] = 'Cell 2G connection';
            states[navigator.connection.CELL_3G] = 'Cell 3G connection';
            states[navigator.connection.CELL_4G] = 'Cell 4G connection';
            states[navigator.connection.CELL] = 'Cell generic connection';
            states[navigator.connection.NONE] = 'No network connection';
            alert('Connection type: ' + states[networkState]);
            console.log(states[networkState])
        }

        $ionicPopover.fromTemplateUrl('./templates/modal.html', {
            scope: $scope,
        }).then(function(popover) {
            $scope.popover = popover;
        });
        $scope.closeImage = function() {
            $scope.popover.hide();
            $scope.$broadcast('scroll.refreshComplete');
        }
        $scope.image = function() {
            $scope.popover.show();
        }

        $scope.validLogin = function() {
            var loginCheck = $localstorage.get("X-Access-Token");
            if (loginCheck == undefined) {
                $state.go('login');
            }

        }

        $scope.settings = {
                enableFriends: true
            }
            //go to website
        $scope.goToSite = function() {
            window.open('http://formsz.com', '_system', 'location=yes');
        }
        $scope.logout = function() {
            var loginFormCredentials = document.getElementById("loginForm");
            if (loginFormCredentials !== null) {
                loginFormCredentials.reset();
            }
            $rootScope.loginstatus = false;
            $window.localStorage.clear();
            $state.go('login');

        }
    })