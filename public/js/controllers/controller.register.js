angular.module('Yakkee')
  .controller('registerController', registerController);

  registerController.$inject = ['$http', 'Auth', '$location'];

  function registerController($http, Auth, $location) {
    var rc = this;

    rc.Auth = Auth;
    rc.signup = function(){
      $http
        .post('/api/users', rc.signupUser)
        .then(function(returnData){
          console.log('SIGNUP : ',returnData );
          if (returnData.data._id) {
            Auth.user = returnData.data
            $location.url('/')
          }
        });
    }
  }
