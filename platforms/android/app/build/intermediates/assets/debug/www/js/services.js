angular.module('starter.services', [])
.service('formsSave', function ($http, alertService,commonService) {
  return {
    saveForm : function (url, data, headers, cb) {
      $http.post(url, data, headers)
      .success(function (res, status) {
        cb(res);
      })
      .error(function (err) {
        console.log(JSON.stringify(err));
        alertService.doAlert("Invalid network");
        commonService.Loaderhide();
      }); 
    },
    saveReassignedForm : function (url, data, headers, cb) {
      $http.put(url, data, headers)
      .success(function (res, status) {
        cb(res);
      })
      .error(function (err) {
        alertService.doAlert("Invalid network");
        commonService.Loaderhide();
      }); 
    },
    savePrepopDataForm:function(url,data,headers,cb){
      $http.put(url, data, headers)
      .success(function (res, status) {
        cb(res);
      })
      .error(function (err) {
        alertService.doAlert("Invalid network");
        commonService.Loaderhide();
      });
    },
    changePassword:function (url,data, headers, cb) {
      $http.post(url,data, headers)
      .success(function (res, status) {
        cb(res);
      })
      .error(function (err) {
        alertService.doAlert("Invalid network");
        console.log(JSON.stringify(err));
        commonService.Loaderhide();
      }); 
    },
    getPrepopData : function (url,headers,cb) {
      $http.get(url,headers)
      .success(function (res, status) {
        cb(res);
      })
      .error(function () {
        alertService.doAlert("Invalid network");
        commonService.Loaderhide();
      }); 
    },
    emailMobileRecords:function (url,data, headers, cb) {
      $http.post(url,data, headers)
      .success(function (res, status) {
        cb(res);
      })
      .error(function (err) {
        alertService.doAlert("Invalid network");
        console.log(JSON.stringify(err));
        commonService.Loaderhide();
      }); 
    },
    insertDownloadedFormInfo : function (url, data, headers, cb) {
      $http.post(url, data, headers)
      .success(function (res, status) {
        cb(res);
      })
      .error(function (err) {
        console.log(JSON.stringify(err));
        alertService.doAlert("Invalid network");
      }); 
    }
  }
})

.factory('$localstorage', ['$window', function ($window) {
      return {
        set : function (key, value) {
          $window.localStorage[key] = value;
        },
        del : function (key) {
          delete $window.localStorage[key];
        },
        get : function (key, defaultValue) {
          return $window.localStorage[key] || defaultValue;
        },
        setObject : function (key, value) {
          $window.localStorage[key] = JSON.stringify(value);
        },
        getObject : function (key) {
          return JSON.parse($window.localStorage[key] || '{}');
        }
        
      }
    }
  ])
.service('alertService', function($ionicPopup) {
            console.log('in pop')

        return {
            doAlert: function(content, callback) {
                $ionicPopup.alert({
                    title: 'Message',
                    content: content
                }).then(function(res) {
                    if (callback)
                        callback(res);
                });
            },
            showToast: function(message) {
                $cordovaToast.show(message, 'long', 'bottom').then(function(success) {}, function(error) {});
            }

  }

})

.service('restServices', function($http,$localstorage,$state,$rootScope){
        var rs = {};
        var selectProjectId;
        var selectedProjectTaskId;
        var selectedProjectDepartmentId;
        rs.restPostType = function(url, data,config,cb) {
           rs.showLoader();
           $http.post(url, data,config).then(function(response){
           
              rs.removeLoader();
              cb(true,response);
           },
            function(response){
              rs.removeLoader();
              cb(false,"fail");
            })
        }

        rs.restExcelType = function(url,config,responseType,data,cb){
         rs.showLoader();
          $http.post(url,data,config,responseType).then(function(response){
              rs.removeLoader();
              cb(true,response);
          },
          function(response){
              rs.removeLoader();
              cb(false,"fail");
          })
        }
        
        rs.restPutType = function(url, data,config,cb) {
          rs.showLoader();
           $http.put(url, data,config).then(function(response){
              rs.removeLoader();
              cb(true,response);
           },
            function(response){
               rs.removeLoader();
               cb(false,"fail");
            })
        }

        rs.restPostTypeForForm = function(url, data,config,cb) {
          rs.showLoader();
          $http.post(url, data,config).then(function(response){
              rs.removeLoader();
              cb(true,response);
          },
          function(response){
              rs.removeLoader();
              cb(false,"fail");
          })
        }

        rs.restGetType = function(url,headers,cb){
          rs.showLoader();
            $http.get(url,headers).then(function(response){
              rs.removeLoader();
              cb(true,response);
            },
            function(response){
              rs.removeLoader();
              cb(false,response);
            })
        }
        rs.restDeleteType=function(url,config,cb){
           rs.showLoader();
           $http.delete(url, config).then(function(response){
            rs.removeLoader();
            cb(true,response);
           }, 
           function(response){
            rs.removeLoader();
            cb(false,response);
           })
        }
        rs.restPutType = function(url,data,config,cb){
           rs.showLoader();
            $http.put(url, data, config).then(function(response){
                rs.removeLoader();
                cb(true,response);
              }, 
              function(response){
                rs.removeLoader();
                cb(false,response);
              }
            );
      }
      rs.getHeaders=function(){
        var access_token = $localstorage.get("X-Access-Token");
        return {
                "Content-Type" : "application/json",
                "X-Access-Token" : access_token,
                "X-Key": "ajay"
             };
      }

      rs.getexcelHeaders=function(){
        var access_token = $localstorage.get("X-Access-Token");
        return {
                "Content-Type" : "application/json",
                "X-Access-Token" : access_token,
                "X-Key": "ajay"
             };
      }
      
      rs.getHeadersdownload=function(){
        var access_token = $localstorage.get("X-Access-Token");
        return {
          // "Content-Type" : "application/json",
          "Content-Type" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "responseType" : "arraybuffer",
          "X-Access-Token" : access_token,
          "X-Key": "ajay"
        };
      }
      rs.getHeadersForPost = function(data,url){
            var access_token = $localstorage.get("X-Access-Token");
            return {
                "Content-Type" : undefined,
                "X-Access-Token"  : access_token ,
                "X-Key": "ajay"    
             };
      }
      rs.showLoader = function () {
        $('body').append('<div class="loader"></div>');
      }
      rs.removeLoader =function(){
        $('.loader').fadeOut(function () {
            $(this).remove();
        });   
      }
      rs.setUserEditStorage = function(data,id,userImage,defaultImage,userName)
      {
        $localstorage.set("userEditInfo",data);
        $localstorage.set("editUserId",id);
        $localstorage.set("updateUserImage",userImage);
       $localstorage.set("defaultImage",defaultImage);
        $localstorage.set("userName",userName);
        
      }
      
      rs.multiDropdownSettings= function()
      {
        var ObjForSettings = {displayProp: 'lable',enableSearch: true};
        //,selectionLimit:3
        return ObjForSettings;
      }
      rs.responseCheck = function(res,view)
      {

        if (res.data.status == 208)
        {
            swal(res.data.message)
        } 
        else if(res.data.status == 204){
            swal(res.data.message);
            
        }
        else if(res.data.status == 202){
            swal(res.data.message);
        }  
        else if(res.data.status == 200){
            swal(res.data.message);
            $state.go(view);
        }
         /*else if(res.status == 200){
            swal(res.data.message);
            $state.go(view);
        }  */     
      }

      rs.responseCheckReload = function(res,view)
      {
        if (res.data.status == 208)
        {
            swal(res.data.message)
        } 
        else if(res.data.status == 204){
            swal(res.data.message);
            
        }
        else if(res.data.status == 202){
            swal(res.data.message);
        }  
        else if(res.data.status == 200){
            $state.reload(view);
             swal(res.data.message);
        }
         /*else if(res.status == 200){
            swal(res.data.message);
            $state.reload(view);
        }   */    
      }
      
       rs.responseCheckWithSplice = function(res,view,categories,index)
      {
        if (res.data.status == 208)
        {
            swal(res.data.message)
        } 
        else if(res.data.status == 204){
            swal(res.data.message);
            
        }
        else if(res.data.status == 202){
            swal(res.data.message);
        }  
        else if(res.data.status == 200){
            swal(res.data.message);
            categories.splice(index,1);
        }
        
      }
      rs.getLoggedUserType = function(){
        if($localstorage.get("userdata"))
          return $localstorage.get("userdata").type
        else
          return null;
      }
      rs.getuserName = function(){
       if($localstorage.get("userdata"))
          return $localstorage.get("userdata").username
        else
          return null; 
      }
      rs.isValidRequest      = function(accessUserStatus)
      {
       
        if($localstorage.get("userdata"))
        { 
          var userType =$localstorage.get("userdata").type
         
          if(accessUserStatus.indexOf(userType)!== -1)
          {
           
            return true;
          }
          else
          { 
            $state.go("login");
            return ;
            
          }
        }
        else
        {
          $state.go("login");
        }
      }


      rs.urlAuth = function(state){
       
        var currentLoggedUserType = $localstorage.get("userdata").type;
        var stateDefines = {
            "pages.admin.view":["0"],
            "pages.dashboard":["0"],
            "pages.usergroups.view":["0"],
            "pages.category.view":["0"],
            "pages.template.get" :["0"]
        }
        
       

        /*if(stateDefines[state].indexOf(currentLoggedUserType)==-1){
          return false
        }
        else
        {
          return true
        }*/
        return true
      }
    
    rs.formRequiredFields = function(data,ArrayOfObjects,flag)
      {
       var reData ={};
       reData.id    = data.id;
       reData.lable = data.lable;
       if(data.type.view !== undefined)
        {
          if(data.type.view == 'textbox')
               {
                if(data.required ==true)
                    {
                       if(ArrayOfObjects.length==0)
                       {
                             ArrayOfObjects.push(reData);
                       }
                       else if(ArrayOfObjects.length!==0)
                        {
                            angular.forEach(ArrayOfObjects,function(v,k){
                                if(v.id == reData.id)
                                {    
                                    ArrayOfObjects[k]= reData;
                                    flag=true;
                                }
                            });
        
                            if(!flag)
                                {
                                    ArrayOfObjects.push(reData);
                            }
                        }
                       
                    }
                 else
                 {
                    var flagForElse = false;;
                    angular.forEach(ArrayOfObjects,function(val,key)
                    {
                      if(val.id == data.id)
                        {
                          flagForElse = true;
                          ArrayOfObjects.splice(key,1);
                        }
                    });
                     if(!flagForElse)
                       ArrayOfObjects =[];
                   }
               }
               if(data.type.view !== 'textbox')
               {
                if(data.required ==true)
                    {
                       if(ArrayOfObjects.length==0)
                       {
                             ArrayOfObjects.push(reData);
                       }
                       else if(ArrayOfObjects.length!==0)
                        {
                            angular.forEach(ArrayOfObjects,function(v,k){
                                if(v.id == reData.id)
                                {
                                    ArrayOfObjects[k]= reData;
                                    flag=true;
                                }
                            });
                            if(!flag)
                                {
                                    ArrayOfObjects.push(reData);
                            }
                        }
                      
                    }
                 else
                 {
                  //ArrayOfObjects.splice(0,1);
                  var flagForElseEdit = false;;
                    angular.forEach(ArrayOfObjects,function(val,key)
                    {
                      if(val.id == data.id)
                        {
                          flagForElseEdit = true;
                          ArrayOfObjects.splice(key,1);
                        }
                    });
                     if(!flagForElseEdit)
                       ArrayOfObjects =[];
                   }
              }}
    }


      rs.getAllUsersList= function(){
        var url= CONSTANTS.getUsersList+"/"+$localstorage.get("userdata").id;
        var headers = rs.getHeaders();
        var config = {};
        config.headers = headers;
        rs.restGetType(url, config, function(status, res) {
           if(res.status = 200)
             $rootScope.totalUsers = res.data;
        });
    }

    rs.setSelctedProjecId = function(projectId)
    {
        selectProjectId = projectId;
    }

    rs.getSelctedProjecId = function()
    {
        return selectProjectId;
    }

    rs.setSelectedProjectTaskId = function(taskId)
    {
      selectedProjectTaskId = taskId;
    }

    rs.getStelectedProjectTaskId = function()
    {
      return selectedProjectTaskId;
    }

    rs.setSelectedProjectDepartmentId = function(projectAdminId)
    {
      selectedProjectDepartmentId = projectAdminId
    }

    rs.getSelectedProjectDepartmentId = function(projectAdminId)
    {
      return selectedProjectDepartmentId ;
    }

        return rs;
    })
     
