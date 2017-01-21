'use strict';

// Create the Socket.io wrapper service
angular.module('Yakkee').service('Socket', ['Auth', '$timeout',
  function (Auth, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      console.log('AURH USER', Auth.user)
      if (Auth.user) {
        this.socket = io();
        // or is this where socket should notify server of online status -- my note
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);
