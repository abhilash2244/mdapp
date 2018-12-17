angular.module('starter.controllers')
    .controller('loginController', function($scope, $stateParams, CONSTANTS, $localstorage, restServices, $rootScope, $state, $ionicPopup, $ionicPopover, commonService) {
        //back to settings
        //back to login
        $scope.backToSettings = function() {
                $state.go("tab.account");
            }
            //back to login
        $scope.backToLogin = function() {
                $state.go("login");
            }
            //show password hide password
        $scope.inputType = 'password';

        $scope.hideShowPassword = function() {
            if ($scope.inputType == 'password')
                $scope.inputType = 'text';
            else
                $scope.inputType = 'password';
        };
        //ppopup for updated [password]
        $scope.passwordUpdated = function() {
            var c = document.getElementById("loginForm");
            if (c !== null) {

                c.reset();
            }
            var alertPopup = $ionicPopup.alert({
                title: '<h2>Password Changed Successfully</h2><br>',
                template: ''

            });
        };
        $scope.goToSite = function() {
                window.open('https://magikminds.com/', '_system', 'location=yes');
            },
            //change password 
            $scope.newPassword = function(passwordData) {
                // var type = localStorageService.get("userdata").type;
                var parameters = "{\"oldpassword\":\"" + passwordData.oldpassword + "\",\"newpassword\":\"" + passwordData.newpassword + "\",\"username\":\"" + $localstorage.get("username") + "\"}";
                var headers = restServices.getHeaders();
                var config = {};
                config.headers = headers;
                var url = CONSTANTS.pwdChange;
                console.log(parameters)
                console.log("in mAIN.JS")
                commonService.LoaderShow('pleasewait');
                restServices.restPostType(url, parameters, config, function(status, data) {
                    commonService.LoaderHide();
                    if (status) {
                        if (data.data.status == 200) {
                            $scope.passwordUpdated();
                            $state.go("login");

                        } else if (data.data.status == 204) {
                            $scope.showInvalidCredentials();
                        } else {
                            swal(CONSTANTS.serverProblem);
                        }
                    } else
                        swal(CONSTANTS.serverProblem);
                });

            }
            // mail id not found
        $scope.mailNotFound = function() {
            // $scope.closeGm();
            var alertPopup = $ionicPopup.alert({
                title: '<h2>Invalid Credentials</h2><br>',
                // template:'Invalid Credentials'

            });
        };

        //sent password to mail
        $scope.sentPassordToMail = function() {
            // $scope.closeGm();
            var alertPopup = $ionicPopup.alert({
                title: '<h2>Password Sent To Mail</h2><br>',
                template: ''

            });
        };

        //you are not authorised
        $scope.unauthorised = function() {
            // $scope.closeGm();
            var alertPopup = $ionicPopup.alert({
                title: '<h2>You Are UnAuthorised</h2><br>',
                template: ''

            });
        };

        //login through web
        $scope.firstLogin = function() {
            // $scope.closeGm();
            var alertPopup = $ionicPopup.alert({
                title: '<h2>Please Change Your Password</h2><br>',
                template: ''

            });

            alertPopup.then(function(res) {
                // $state.go('tab.chats');
                console.log("first Login ");
            });
        };

        //invalid network
        $scope.invalidNetwork = function() {
            // $scope.closeGm();
            var alertPopup = $ionicPopup.alert({
                title: '<h2>Invalid Network</h2><br>',
                template: ''

            });
        };

        //invalid credentials
        $scope.showInvalidCredentials = function() {
            // $scope.closeGm();
            var alertPopup = $ionicPopup.alert({
                title: '<h2>Invalid credentials</h2><br>',
                template: ''

            });
        };

        $scope.login = function(user) {
            var headers = restServices.getHeaders();
            var config = {};
            config.headers = headers;
            var url = CONSTANTS.login;
            console.log(user.username)
            $localstorage.set("loginDataUsername", user.username);
            $localstorage.set("loginDataPassword", user.password);

            commonService.LoaderShow('pleasewait');
            restServices.restPostType(url, user, config, function(status, data) {
                commonService.LoaderHide();
                if (navigator.onLine == false) {
                    $scope.invalidNetwork();
                }

                try {
                    if (data.data.status == 200) {

                        $rootScope.checkLength = data.data.user.length;

                        if (data.data.user[1] != undefined) {
                            $localstorage.set("dualUser", data.data.user[1]);
                            $localstorage.set("hasdualPermission", true);
                        } else {
                            $localstorage.set("hasdualPermission", false);
                        }

                        data.data.user = data.data.user[0];

                        var admingroup = data.data.user;
                        $localstorage.set("loginUser", admingroup);

                        if (data.data.user.type == '1' && data.data.user.groupname.length > 0) {
                            $scope.unauthorised();
                        }
                        //added by renuka
                        else if (data.data.user.type == '3' && data.data.user.groupname.length > 0) {
                            $localstorage.set("Departments", data.data.user.groupname)
                            data.data.user.groupid = data.data.user.groupname;
                            data.data.user.userid = data.data.user._id;

                        }
                        $localstorage.set("userdata", data.data.user);
                        $localstorage.set("X-Access-Token", data.data.token);
                        $localstorage.set("GroupName", data.data.user.groupname);
                        $localstorage.set("username", data.data.user.name);
                        $localstorage.set("GroupId", data.data.user.groupid);
                        if (data.data.user.groupid != null) {
                            if (data.data.user.type == '1') {
                                if (data.data.user.isFirstLogin == true) {
                                    $scope.alert("login through web");
                                    $state.transitionTo("changePassword");

                                } else {
                                    // $state.go("tab.chats");
                                }
                            } else if (data.data.user.type == '3') {
                                if (data.data.user.isFirstLogin == true) {
                                    //  $scope.alert("login through web");
                                    $scope.firstLogin();
                                    $state.transitionTo("changePassword");

                                } else {
                                    $rootScope.user = data.data.user.name;
                                    console.log($rootScope.user)
                                    $state.go("tab.complaints");
                                    $rootScope.loginstatus = true;
                                }
                            } else
                                swal("you are authorized user,but dont have privilage to login")
                        } else if (!data.data.user.groupid || !data.data.user.groupname) {

                            if (data.data.user.type == '1')
                                swal("User Group should be assigned");
                            else if (data.data.user.type == '0')
                                $scope.unauthorised();

                        }
                    } else if (data.data.status == 204) {
                        $scope.invalidCrd = true;
                        $scope.showInvalidCredentials();
                    } else if (data.data.status == undefined) {
                        $scope.invalidNetwork();
                    } else {
                        $scope.somethingWrong();
                        swal(CONSTANTS.serverProblem);
                    }
                } catch (err) {
                    console.log(err)
                }

            });

        }

        var datenow = new Date();
        $rootScope.fromdate = datenow;
        $rootScope.todate = datenow;

        $ionicPopover.fromTemplateUrl('./templates/forgotPassword.html', {
            scope: $scope,
        }).then(function(popover) {
            $scope.popover = popover;
        });
        $scope.closeGm = function() {
            $scope.popover.hide();
        }

        //forgot password prompt

        $scope.reset = function(changePwd) {
            //console.log($scope.changePwd)
            var changePwd = $scope.changePwd;
            var headers = restServices.getHeaders();
            var config = {};
            config.headers = headers;
            var url = CONSTANTS.forgotPassword;
            console.log(changePwd);
            commonService.LoaderShow('pleasewait');
            restServices.restPostType(url, changePwd, config, function(status, data) {
                commonService.LoaderHide();
                if (status) {
                    if (data.status == 200) {
                        if (data.data.status == 200) {
                            $scope.sentPassordToMail();
                            $state.reload("login");
                        } else if (data.data.status == 204) {
                            $scope.mailNotFound();
                        }

                    } else if (data.status == 204) {
                        $scope.mailNotFound();
                        swal(data.data.message);
                    } else {
                        swal(CONSTANTS.serverProblem);
                    }
                }

            });

        }

        $scope.forgotPassword1 = function() {

            $scope.newitem = {}

            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="changePwd.username" class="form-control" placeholder="Enter Username/Email" tabIndex="1" required>',
                title: 'New item',
                subTitle: 'Add new item to list',
                scope: $scope,
                buttons: [{
                    text: 'Cancel'
                }, {
                    text: '<b>Submit</b>',
                    template: '<input type="submit" ng-click="reset(changePwd)">',
                    onTap: function() {

                        console.log($scope.username)
                            //$scope.reset(changePwd);
                    }
                }],

            });
        }

        // showpopup method code
        $scope.forgotPassword = function() {
            console.log("in popup")
            $scope.showPopup = function() {
                $scope.changePwd = {}

                var myPopup = $ionicPopup.show({
                    template: '<input type="text" style="height:30px;margin-top:-14px;" placeholder="Email/Username" ng-model="changePwd.username">',
                    title: '<h2>Please Enter Registered Email/Username</h2>',
                    // placeholder:'Enter Email/username',
                    //subTitle: 'Please use normal things',

                    scope: $scope,
                    buttons: [{
                        text: 'Cancel'
                    }, {
                        text: '<b>Submit</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.changePwd.username) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                return $scope.changePwd;
                            }
                        }
                    }, ]
                });
                myPopup.then(function(res) {

                    if (res) {

                        if (res.username !== null) {
                            $scope.reset();

                            //console.log(res + 'Password Is Ok');
                        } else {
                            console.log('Password not matched');
                        }
                    } else {
                        console.log('Enter password');
                    }

                });

            };
            $scope.showPopup();

        }

        $scope.forgotPassword2 = function() {
            console.log("here")
            $ionicPopup.prompt({
                title: 'password will be sent to this email',
                // template: '<input type="text" name="uname" ng-model="changePwd.username" class="form-control" placeholder="Enter Username/Email" tabIndex="1" required>',
                title: 'Ionic Popup',
                template: 'This is prompt popup'
                    // subTitle: 'password will be sent to this email',
                    //inputType: 'email',
                    //inputPlaceholder: 'Email/Username',
                    // data-ng-model:'changePwd.username'
            }).then(function(res) {
                console.log($scope.changePwd);
                console.log('Your name is', res);
                $scope.username = res;
                $scope.reset(changePwd)
            });

        }

        //automatic login

        if ($localstorage.get("loginDataUsername") !== undefined) {
            console.log($localstorage.get("loginDataUsername"));
            var user = {};
            user.username = $localstorage.get("loginDataUsername")
            user.password = $localstorage.get("loginDataPassword")
            console.log(user)

            $scope.login(user);
        }
        console.log($localstorage.get("loginDataUsername"));

    });