angular.module('Yakkee')
  .controller('signinController', signinController);

  signinController.$inject = ['$http', 'Auth', '$location', 'Socket'];

  function signinController($http, Auth, $location, Socket) {
    var sc = this;

    sc.Auth = Auth;
    sc.signin = function(){
      Socket.connect();
      $http
        .post('/api/users/login', sc.signinUser)
        .then(function(returnData){
          console.log('signin controller says: ', 'SIGNIN : ', returnData );
          if (returnData.data._id) {
            console.log('The if statement in the signin function was tripped');
            Auth.user = returnData.data;
            Socket.emit('signedIn', Auth.user);
            $location.url('/');
          }
        });
    }
  }
