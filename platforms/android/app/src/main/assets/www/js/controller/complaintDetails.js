angular.module('starter.controllers')

.controller('complaintDetailsController', function($scope, $stateParams, $rootScope, $state, $ionicPopover, CONSTANTS, restServices, $http, $localstorage, $ionicPopup, $ionicModal, formsSave, commonService, $cordovaToast) {
    //drop downs in visitor details
    $(document).ready(function() {
        $(".addressHide").hide();
        $(".hideAddress").click(function() {
            $(".addressHide").toggle();
        });
    });
    //show/hide attachments
    $(document).ready(function() {
        $(".attachmentHide").hide();
        $(".hideAttachment").click(function() {
            $(".attachmentHide").toggle();
        });
    });

    function visitorRecordId() {
        for (var i = 0; i < $rootScope.completeRecords.length; i++) {
            if ($rootScope.completeRecords[i].TextBox__name_2006749 == $rootScope.getVisitorDataId) {
                console.log($rootScope.getVisitorDataId)
                var selectedid = $rootScope.recordId[i];
                $rootScope.recid = selectedid;
                $scope.recordInfoUploaded = $rootScope.recordInfo[i];
                // console.log($scope.recordInfoUploaded.UpdatedBy)
            }
        }
    }

    $ionicPopover.fromTemplateUrl('./templates/modal.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popoverImage = popover;
    });
    $scope.closeImage = function() {
        $scope.popoverImage.hide();
        $scope.$broadcast('scroll.refreshComplete');
    }
    $scope.openImage = function(image) {
        $scope.imgurl = image;
        $scope.popoverImage.show();
    }

    $scope.validLogin = function() {
        if ($localstorage.get("X-Access-Token") == undefined) {
            $state.go('login');
        }
    }

    //md accepted successful 
    $scope.mdUpdateSuccess = function() {
        var alertPopup = $ionicPopup.alert({
            template: '<h2>Submitted Successfully</h2>'
                // template: '<h2>'+$scope.mccToken+'</h2>'
        });
        alertPopup.then(function(res) {
            $state.go('tab.complaints');
            $rootScope.getFilterredFroms();

        });
    };

    //internal server error 
    $scope.error = function() {
        var alertPopup = $ionicPopup.alert({
            template: '<h2>Internal server error </h2>'
                // template: '<h2>'+$scope.mccToken+'</h2>'
        });
        alertPopup.then(function(res) {
            // $state.go('tab.complaints');
            // $rootScope.getFilterredFroms();

        });
    };
    //edp service error 
    $scope.edpError = function() {
        var alertPopup = $ionicPopup.alert({
            template: '<h2>EDP services Not Reachable </h2>'
                // template: '<h2>'+$scope.mccToken+'</h2>'
        });
        alertPopup.then(function(res) {
            // $state.go('tab.complaints');
            // $rootScope.getFilterredFroms();

        });
    };

    //show popup rejected
    $scope.showPopupRejected = function() {
        // $scope.closeGm();
        var alertPopup = $ionicPopup.alert({
            // title: 'Submitted Successfully',
            template: '<h2>Submitted Successfully</h2>'
        });
        alertPopup.then(function(res) {
            $state.go('tab.complaints');
        });
    };

    //popup on assignment
    $scope.showPopupAssignment = function() {
        // $scope.closeGm();
        var alertPopup = $ionicPopup.alert({
            // title: 'Assigned ',
            template: 'Assigned Successfully'
        });
        alertPopup.then(function(res) {
            console.log('assign success');
            $rootScope.getFilterredFroms();
            $state.go('tab.complaints');
        });
    };

    //show popup rejected
    $scope.somethingWrong = function() {
        // $scope.closeGm();
        var alertPopup = $ionicPopup.alert({
            title: 'Something Went Wrong ',
            template: '<h2>Please Try Again After Sometime</h2>'
        });
        alertPopup.then(function(res) {
            $state.go('tab.complaints');
        });
    };

    //mail pdf for gm and cgm
    $scope.sendAttachment = function(user) {
        var userAssigned = user
        var data = {};
        var metaDataInfo;
        data.formid = $rootScope.formIdSelected
        data.taskid = $rootScope.taskIdSelected
        data.user = $localstorage.get("username");;
        data.fromdate = "";
        data.todate = "";
        data.username = userAssigned
        var recordsSelected = [];
        recordsSelected.push($rootScope.recid);
        data.records = recordsSelected;
        var metadata = {};
        metadata["taskName"] = "MYMD";
        metadata["projectName"] = "MYMD";
        metadata["departmentAdmin"] = "Admin";
        metadata["groupAdmin"] = "MD";
        data.metaDataInfo = [metadata];
        data["type"] = "mail";
        if (data.altemail == "undefined" || data.altemail == null) {
            data.altemail = null;
        }
        var emailIds;
        if (data['altemail'])
            emailIds = data['altemail'].split(";");
        data['altemail'] = emailIds;
        var headers = restServices.getHeaders();
        var config = {};
        config.headers = headers;
        //var url = CONSTANTS.emailtaskRecords;
        if (data.fileType == 1)
            var url = CONSTANTS.emailtaskRecords;
        else
            var url = CONSTANTS.pdfEmail;
        console.log(data)
        restServices.restPostType(url, data, headers, function(status, data) {
            console.log("in email pdf")
        });
    }

    //direct reassign on accepting a complaint
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
        // obj.recordId = $rootScope.asignrecd;
        obj.recordId = $rootScope.recid
        console.log($rootScope.recid)
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
                    var id = $rootScope.recid;
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
                            $scope.sendAttachment(user);
                        }
                    });
                }
            })
            // $scope.$broadcast('show-error-event');
    }

    //updating the record by md submit form data
    $scope.submitTaskFormData = function(type) {
        //mcc token service 
        if (type == 'accepted') {

            commonService.LoaderShow('pleasewait');
            var url = CONSTANTS.mcctoken;
            var obj = {};
            var arr = [];
            var securityHeaders = restServices.getHeaders();
            obj.canNo = $scope.canInfo.TextBox__name_2003980;
            obj.address = $scope.canInfo.Textarea__Name_2011279;
            obj.mobileNo = $scope.canInfo.TextBox__name_2012433;
            obj.sectionCode = $scope.canInfo.TextBox__name_1144009;
            obj.complaintType = $scope.canInfo.Dropdown__name_1818644;
            obj.reasonCode = $scope.canInfo.Dropdown__name_1852157;
            obj.comments = $scope.canInfo.Textarea__Name_2020713;
            console.log(obj)
            formsSave.saveForm(url, obj, securityHeaders, function(response) {
                commonService.LoaderHide();
                if (response.status == 200) {
                    console.log(response.token)
                        // update record as accepted or rejected
                    $scope.canInfo.TextBox__name_1754324 = response.token
                    $scope.canInfo.TextBox__name_1416640 = type;
                    var obj = {};
                    var arr = [];
                    var securityHeaders = restServices.getHeaders();
                    //console.log(securityHeaders)
                    console.log($scope.canInfo.TextBox__name_1416640)
                    arr.push($scope.canInfo)
                    obj.record = arr;
                    obj.formId = $rootScope.formIdSelected;
                    obj.taskId = $rootScope.taskIdSelected;
                    obj.version = $rootScope.version;
                    var datenow = new Date();
                    var isoDate = datenow.toISOString();
                    obj.updatedTime = isoDate;
                    obj.updatedBy = $scope.recordInfoUploaded.UpdatedBy;
                    visitorRecordId();
                    obj.recordId = $rootScope.recid;
                    console.log(obj.recordId)
                    var url = CONSTANTS.mdupdate;
                    obj.lat = $scope.lat;
                    obj.long = $scope.long;
                    var generatedId = Date.now();
                    obj.generatedId = generatedId;
                    // console.log(obj.record)
                    // console.log(securityHeaders)
                    commonService.LoaderShow('pleasewait');
                    formsSave.saveForm(url, obj, securityHeaders, function(response) {
                        commonService.LoaderHide();
                        if (response.status == 200) {
                            console.log($scope.canInfo.Dropdown__name_1603849);
                            if (type == 'accepted') {
                                $scope.assignrecord2gm($scope.canInfo.Dropdown__name_1603849);
                            } else {
                                commonService.Loaderhide();
                                $scope.mdUpdateSuccess();
                            }
                            // $scope.assignrecord2gm($scope.canInfo.Dropdown__name_1603849);
                        }
                        if (response.status == 204) {
                            commonService.Loaderhide();
                            alertService.doAlert("This record alreaady submited by other user,please contact adminstratore");
                        } else {
                            //   var deferredForSaveRecordVideoPromise = deferredForSaveRecord.promise;
                        }
                    });
                } else {
                    $scope.error();
                    console.log('internal server error')
                }
            })
        } else if (type == 'rejected') {
            console.log("here")
            $scope.canInfo.TextBox__name_1416640 = type;
            var obj = {};
            var arr = [];
            var securityHeaders = restServices.getHeaders();
            //console.log(securityHeaders)
            console.log($scope.canInfo.TextBox__name_1416640)
            arr.push($scope.canInfo)
            obj.record = arr;
            obj.formId = $rootScope.formIdSelected;
            obj.taskId = $rootScope.taskIdSelected;
            obj.version = $rootScope.version;
            var datenow = new Date();
            var isoDate = datenow.toISOString();
            obj.updatedTime = isoDate;
            obj.updatedBy = $scope.recordInfoUploaded.UpdatedBy;
            visitorRecordId();
            obj.recordId = $rootScope.recid;
            console.log(obj.recordId)
            var url = CONSTANTS.mdupdate;
            obj.lat = $scope.lat;
            obj.long = $scope.long;
            var generatedId = Date.now();
            obj.generatedId = generatedId;
            formsSave.saveForm(url, obj, securityHeaders, function(response) {
                commonService.LoaderHide();
                if (response.status == 200) {
                    $scope.mdUpdateSuccess();
                }
            })
        }
    }

    $scope.clearCanvas = function() {
        signaturePad.clear();
    }

    $scope.saveCanvas = function() {
        var sigImg = signaturePad.toDataURL('image/png');
        $scope.canInfo.Signature_1209189 = sigImg;
        $scope.signature = sigImg;
        signaturePad.clear();
        context.clearRect(0, 0, canvas.width, canvas.height);
        delete signaturePad;
        // $scope.sigpopover.remove();
        window.addEventListener("resize", resizeCanvas);
        var ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = (canvas.offsetHeight * ratio) * 2;
        canvas.getContext("2d").scale(ratio, ratio);
        signaturePad.clear(); // otherwise isEmpty() might return incorrect value
    }

    //signature popover
    $ionicPopover.fromTemplateUrl('./templates/signature.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popoverSignature = popover;
    });

    $scope.closeSignature = function() {
        $scope.popoverSignature.hide();
    }

    $scope.showSignature = function() {
        $scope.popoverSignature.show();
    }

    //previous complaints popover
    $ionicPopover.fromTemplateUrl('./templates/previousComplaints.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popoverPreviousComplaints = popover;
    });

    $scope.closePreviousComplaints = function() {
        $scope.popoverPreviousComplaints.hide();
    }

    $scope.showPreviousComplaints = function($event) {
        $scope.popoverPreviousComplaints.show($event);
    }

    //revenue popover
    $ionicPopover.fromTemplateUrl('./templates/revenueDetails.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popoverRevenue = popover;
    });

    $scope.closeRevenue = function() {
        $scope.popoverRevenue.hide();
    }

    $scope.showRevenue = function() {
        $scope.popoverRevenue.show();
    }

    //ellipse popover
    $ionicPopover.fromTemplateUrl('./templates/ellipsepopover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.closeMenu = function() {
        $scope.popover.hide();
    }

    $scope.showMenu = function($event) {
        $scope.popover.show($event);
    }

    //revenue service
    $scope.revenue = function(canno) {
        $scope.closePreviousComplaints();
        $scope.closeMenu();

        var url = CONSTANTS.revenue + canno;
        var headers = restServices.getHeaders();
        var config = {};
        config.headers = headers;
        commonService.LoaderShow('pleasewait');
        restServices.restGetType(url, config, function(status, res) {
            commonService.LoaderHide();
            if (res.status == 200) {
                if (res.data.status == 204) {
                    $scope.edpError();
                } else {
                    $scope.showRevenue();
                    $scope.revenuedetails = res.data;
                }
            } else {
                $scope.error();
            }

        });
    }

    $scope.previouscomplaints = function(canno) {
        $rootScope.isPreviouscomplaintsEnabled = true;
        $scope.closeRevenue();
        $scope.closeMenu();

        var url = CONSTANTS.previouscomplaints + canno;
        var headers = restServices.getHeaders();
        var config = {};
        config.headers = headers;
        commonService.LoaderShow('pleasewait');
        restServices.restGetType(url, config, function(status, res) {
            commonService.LoaderHide();

            if (res.status == 200) {
                if (res.data.status == 204) {
                    $scope.edpError();
                } else {
                    $scope.showPreviousComplaints();
                    $rootScope.precomplaints = res.data;
                }
            } else {
                $scope.error();
            }
        });
    }

    $scope.showSignaturePad = function($event, index, id) {
        $rootScope.isSignaturePadEnabled = true;
        $scope.signIndex = index;
        $ionicPopover.fromTemplateUrl('templates/signature.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(popover) {
            $scope.sigpopover = popover;
            $scope.sigpopover.show($event);
            var canvas = document.getElementById('signatureCanvas1');

            var context = canvas.getContext('2d');

            window.setTimeout(function() {
                var signaturePad = new SignaturePad(canvas, {
                    minWidth: 1,
                    maxWidth: 1.5
                });

                $scope.closeSignaturePadPopover = function() {
                    $rootScope.isSignaturePadEnabled = false;
                    $scope.sigpopover.remove();
                };
                $scope.clearCanvasPad = function() {
                    signaturePad.clear();
                }
                $scope.saveCanvasPad = function() {
                    if (signaturePad.isEmpty()) {
                        signaturePad.clear();
                    } else {
                        var sigImg = signaturePad.toDataURL();
                        $scope.canInfo.Signature_1209189 = sigImg;
                        signaturePad.clear();
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        delete signaturePad;
                        $scope.sigpopover.remove();
                    }
                }

                function resizeCanvas() {
                    var ratio = Math.max(window.devicePixelRatio || 1, 1);
                    canvas.width = canvas.offsetWidth * ratio;
                    canvas.height = (canvas.offsetHeight * ratio) * 2;
                    canvas.getContext("2d").scale(ratio, ratio);
                    signaturePad.clear(); // otherwise isEmpty() might return incorrect value
                }

                window.addEventListener("resize", resizeCanvas);
                resizeCanvas();
            }, 300);
        });
        var flag = false;
        $scope.$on('popover.removed', function() {
            flag = true;
        });
        var clearSigPad = function() {
            $scope.sigpopover.remove();
        };
        $scope.$on('popover.hidden', function() {
            if (flag == false) {
                clearSigPad();
            }
            return;
        });
    }

    $scope.backToComplaints = function() {
        $state.go('tab.complaints');
    }

    $scope.backToDashboard = function() {
        $state.transitionTo('tab.dashboard');
    }

    // $scope.complaint = Chats.get($stateParams.complaintId);
    function visitorDetails() {
        for (var i = 0; i < $rootScope.completeRecords.length; i++) {
            if ($rootScope.completeRecords[i].TextBox__name_2006749 == visitorno) {
                var canInformation = $rootScope.completeRecords[i];
                $scope.canInfo = canInformation;
                var count = 0;
                if ($scope.canInfo.Image__Name_1156787 && $scope.canInfo.Image__Name_1156787 !== '') {
                    count = count + 1;
                }
                if ($scope.canInfo.Image__Name_1158897 && $scope.canInfo.Image__Name_1158897 !== '') {
                    count = count + 1;
                }
                if ($scope.canInfo.Image__Name_1200438 && $scope.canInfo.Image__Name_1200438 !== '') {
                    count = count + 1;
                }
                if ($scope.canInfo.Image__Name_1201580 && $scope.canInfo.Image__Name_1201580 !== '') {
                    count = count + 1;
                }
                $scope.count = count;
                $scope.recordInfoUploaded = $rootScope.recordInfo[i];
            }

        }
    }

    if ($stateParams.complaintId != null) {
        var visitorno = $rootScope.getVisitorDataId;
        visitorDetails();
    }
    $rootScope.currentstate = $state.current.url;
})