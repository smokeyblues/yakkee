angular.module('Yakkee', ['ngRoute'])
  .config(Router);

Router.$inject = ['$routeProvider', '$locationProvider'];

function Router ($routeProvider, $locationProvider) {
  // $locationProvider.html5Mode(true);
  $routeProvider
    .when("/", {
      templateUrl   : 'html/home.html',
      controller    : 'homeController',
      controllerAs  : 'hc'
    })
    .when("/signup", {
      templateUrl   : 'html/register.html',
      controller    : 'registerController',
      controllerAs  : 'rc'
    })
    .when("/signin", {
      templateUrl   : 'html/signin.html',
      controller    : 'signinController',
      controllerAs  : 'signin'
    })
}
