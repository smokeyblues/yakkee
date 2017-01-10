angular.module('Yakkee')
  .controller('homeController', homeController);

  homeController.$inject = ['$http', '$location'];

  function homeController($http, $location) {
    var hc = this;

    hc.parallax = function() {
      $('.parallax').parallax()
    }

    hc.sideNav = function() {
      $('.button-collapse').sideNav();
    }


  }
