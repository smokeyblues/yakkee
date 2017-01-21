'use strict';

// Create the Socket.io wrapper service
angular.module('Yakkee').service('Socket', ['Auth', '$timeout',
  function (Auth, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      var sock = this;
      // Connect only when authenticated
      console.log('AURH USER', Auth.user)
      Auth.checkAuth()
        .then(function(user){
          if (user) {
            sock.socket = io();
            // or is this where socket should notify server of online status -- my note
          }
        })

    };
    sock.connect();

    // Wrap the Socket.io 'on' method
    sock.on = function (eventName, callback) {
      if (sock.socket) {
        sock.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    sock.emit = function (eventName, data) {
      if (sock.socket) {
        sock.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    sock.removeListener = function (eventName) {
      if (sock.socket) {
        sock.socket.removeListener(eventName);
      }
    };
  }
]);
