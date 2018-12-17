// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','starter.constants','ngStorage','oc.lazyLoad','ngCordova'])

.run(function($ionicPlatform,$ionicPopup,$rootScope,$cordovaToast) {
  $ionicPlatform.ready(function() {

        document.addEventListener("offline", onOffline, false);
        document.addEventListener("online", onOnline, false);

     function onOffline() {
          $cordovaToast.show('You are Offline', 'long', 'bottom').then(function(success) {
              console.log("The toast was shown");
          }, function (error) {
              console.log("The toast was not shown due to " + error);
          });
     
            $rootScope.isNetworkAvailable=false;
         
         }

    function onOnline() {
      $cordovaToast.show('You are online', 'short', 'bottom').then(function(success) {
               console.log("The toast was shown");
           }, function (error) {
                console.log("The toast was not shown due to " + error);
            });   
       $rootScope.isNetworkAvailable=true;
    
    }


if(window.Connection) {
      if(navigator.connection.type == Connection.NONE) {
        $ionicPopup.alert({
          title: 'No Internet Connection',
          content: 'Sorry, no Internet connectivity detected. Please reconnect and try again.'
        })
        // .then(function(result) {
        //   if(!result) {
        //     ionic.Platform.exitApp();
        //   }
        // });
      }
    }

// document.getElementById("networkInfo").addEventListener("click", networkInfo);
// document.addEventListener("offline", onOffline, false);
// document.addEventListener("online", onOnline, false);



    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
    if (window.cordova && window.Keyboard) {
      window.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ocLazyLoadProvider) {




 $ocLazyLoadProvider.config({
      debug:false,
      events:true,
    });

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
.state('login', {
    url: '/login',
   
        templateUrl: 'templates/login.html',
        controller: 'loginController',
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'starter',
              files:['js/controller/loginController.js']
            })
          }
        }
      
    
  })
.state('changePassword', {
    url: '/changePassword',
        templateUrl: 'templates/changePassword.html',
        controller: 'loginController',
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'starter',
              files:['js/controller/loginController.js']
            })
          }
        }
        
      
    
  })
.state('aboutus', {
    url: '/aboutus',
        templateUrl: 'templates/aboutus.html',
        controller: 'AccountCtrl',
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'starter',
              files:['js/controller/accountController.js']
            })
          }
        }
        
      
    
  })
  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'tabsController'
  })

  // Each tab has its own nav history stack:
 
  // .state('tab.dash', {
  //   url: '/dash',
  //   views: {
  //     'tab-dash': {
  //       templateUrl: 'templates/tab-dash.html',
  //       controller: 'DashCtrl'
  //     }
  //   }
  // })

  .state('tab.complaints', {
      url: '/complaints',
      views: {
        'tab-complaints': {
          templateUrl: 'templates/complaints.html',
          controller: 'complaintCtrl'
        },
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'starter',
              files:['js/controller/complaintCtrl.js']
            })
          }
        }
      }
    })
  .state('tab.dashboard', {
      url: '/dashboard',
      views: {
        'tab-dashboard': {
          templateUrl: 'templates/dashboard.html',
          controller: 'complaintCtrl'
        },
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'starter',
              files:['js/controller/complaintCtrl.js']
            })
          }
        }        
      }
    })

  // .state('tab.dashboard', {
  //     url: '/dashboard',
  //     views: {
  //       'tab-dashboard': {
  //         templateUrl: 'templates/dashboard.html',
  //         controller: 'dashboardController'
  //       },
  //       resolve: {
  //         loadMyFiles:function($ocLazyLoad) {
  //           return $ocLazyLoad.load({
  //             name:'starter',
  //             files:['js/controller/dashboardController.js']
  //           })
  //         }
  //       }
  //     }
  //   })
  
    .state('tab.complaint-detail', {
      url: '/complaints/:complaintId',
      views: {
        'tab-complaints': {
          templateUrl: 'templates/complaintDetails.html',
          controller: 'complaintDetailsController'
        },
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              // name:'sbAdminApp',
              files:['js/controller/complaintDetails.js']
            })
          }
        }

      }
    })

    .state('tab.dashboard-detail', {
      url: '/dashboard/:complaintId',
      views: {
        'tab-dashboard': {
          templateUrl: 'templates/dashboardDetails.html',
          controller: 'complaintDetailsController'
        },
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              // name:'sbAdminApp',
              files:['js/controller/complaintDetails.js']
            })
          }
        }

      }
    })



  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
