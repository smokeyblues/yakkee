angular.module('Yakkee')
  .controller('vcController', vcController);

  vcController.$inject = ['$http', 'Auth', '$location'];

  function vcController($http, Auth, $location) {
    var vc = this;

    vc.hangup = function() {
      $location.url('/');
    }
  }
