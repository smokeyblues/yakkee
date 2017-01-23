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
}
