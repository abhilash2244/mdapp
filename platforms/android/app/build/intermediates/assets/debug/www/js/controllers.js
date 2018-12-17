angular.module('starter.controllers', ['starter.services'])

// .controller('DashCtrl', function($scope) {})


// .controller('complaintDetailsController', function($scope, $stateParams, Chats,$rootScope,$state,$ionicPopover,CONSTANTS,restServices,$http, $localstorage,$ionicPopup,$ionicModal) {

// })
.controller('tabsController', function($scope,$localstorage,$state,$rootScope,$window) {


$scope.previousPageValidation=function(){
    console.log("am in prevous validation")
  }
  $scope.validLogin=function(){
        var x=$localstorage.get("X-Access-Token");
        if(x == undefined){
        $state.go('login'); 
      }

      }

 
});

