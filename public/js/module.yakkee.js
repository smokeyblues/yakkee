angular.module('Yakkee', ['ngRoute', 'ngResource', 'ngFileUpload'])
  .config(Router);

Router.$inject = ['$routeProvider', '$locationProvider'];

function Router ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  $routeProvider.otherwise('/');

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

  $routeProvider
    .when('/', {
      templateUrl   : '/html/home.html',
      controller    : 'homeController',
      controllerAs  : 'hc'
    })
    .when('/signup', {
      templateUrl   : '/html/register.html',
      controller    : 'registerController',
      controllerAs  : 'rc'
    })
    .when('/signin', {
      templateUrl   : '/html/signin.html',
      controller    : 'signinController',
      controllerAs  : 'sc'
    })
    // .when('/dashboard', {
    //   templateUrl   : '/html/dashboard.html',
    //   controller    : 'homeController',
    //   controllerAs  : 'hc'
    // })
    .when('/video-yak/:videoRoomID', {
      templateUrl   : '/html/videochat.html',
      controller    : 'vcController',
      controllerAs  : 'vc'
    })
    .when('signup-passport', {
      templateUrl   : '/html/signup-passport',
      controller    : 'passportController',
      controllerAs  : 'passportCtrl'
    })
    .when('signin-passport', {
      templateUrl   : '/html/signin-passport',
      controller    : 'passportController',
      controllerAs  : 'passportCtrl'
    })
    // .when('/myprofile', {
    //   templateUrl   : '/html/myprofile.html',
    //   controller    : 'profieController',
    //   controllerAs  : 'prfileCtrl'
    // })
}
