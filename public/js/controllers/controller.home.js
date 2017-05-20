angular.module('Yakkee')
  .controller('homeController', homeController);

  homeController.$inject = ['$scope', '$http', '$location', '$filter', 'Auth', 'User', 'Socket', '$sce'];

  function homeController($scope, $http, $location, $filter, Auth, User, Socket, $sce) {
    var hc = this;
    hc.$sce = $sce;
    hc.placeholder = "With whom would you care to Yak?"

    hc.inviteReceived = false;
    hc.loader = false;

    // sendInvite is the function that triggers a call.

    // It emits an event vcInviteReceived that joins the socket.io chat room created when a user logs in. Each user has their own.
    // Within this room an event called triggerInvite is triggered. The homeController is listening for this event but it is only triggered on the front end of the targeted user because it only went through their chat room.
    // When triggerInvite is received it runs a function using the $apply method in order to render the changes immediately.
    // These changes include toggling the inviteReceived value to true which makes the div with all the inviteData visible to the targeted user.
    // It also passes the data from the sendInvite function to the front end in order to dynamically communicate who sent the message. 

    // Triggers invite to user (to) from signed in user (from). All the logic is handled in server.js.
    // emits the event 'vcInviteReceived' that is being listened for on line 138 of server.js
    // also starts the loader to imitate a ringing video phone

    hc.sendInvite = function (to, from) {
      console.log(`'sendInvite' function was triggered`);
      hc.loader = true;
      console.log(from.firstName + ' ' + from.lastName + ' to ' + to.firstName + ' ' + to.lastName);
       var roomName = 'room' + to._id;
       var inviteUrl = 'https://meet.jit.si/' + to._id + '_' + from._id;
      // console.log(to);
       var inviteData = {
        sender: from,
        receiver: to,
        link: inviteUrl
      }
      console.log('inviteUrl: ', inviteUrl);
      console.log('vcInviteReceived should be emitted on next line');
      Socket.emit('vcInviteReceived', inviteData);
      console.log('RoomName: ' + roomName);
      hc.cancelCallData = roomName;
    }

    hc.cancelCall = function() {
      console.log('cancelCall button is working');
      hc.loader = false;
      Socket.emit('callCancelled', hc.cancelCallData);
    }

    Socket.on('cancelInvite', function() {
      hc.inviteReceived = !hc.inviteReceived;
    })

    Socket.on('beacon', function(){
      console.log('socket.io is working');
    })

    // 'triggerInvite' logic

    // 1. set inviteReceived to true for the user that received the invite through their private room.

    Socket.on('triggerInvite', function(inviteData){
      console.log('triggerInvite was triggered');
      $scope.$apply(function() {
        hc.inviteReceived = true;
        console.log('inviteReceived is now set to ', hc.inviteReceived);
        hc.invitation = inviteData;
        console.log(hc.invitation);
      });
    });

    Socket.on('hcYourInviteWasAccepted', function(rsvpReturned) {
      $scope.$apply(function() {
        hc.loader = false;
        $location.url('/video-yak/' + rsvpReturned.sender._id + '_' + rsvpReturned.receiver._id);
      })
    })

    hc.inviteAccepted = function(rsvp) {
      console.log('Invite from ' + rsvp.sender.firstName + ' ' + rsvp.sender.lastName + ' ' + rsvp.receiver.firstName + ' ' + rsvp.receiver.lastName + ' was accepted');
      hc.inviteReceived = false;
      Socket.emit('yourInviteWasAccepted', rsvp);
      $location.url('/video-yak/' + rsvp.sender._id + '_' + rsvp.receiver._id)
    }

    hc.inviteDenied = function() {
      hc.inviteReceived = false;
    };

    User.query(function (data) {
      hc.users = data;
      // console.log(hc.users);
      hc.userNames = hc.users.map(function(element) {
        return element.firstName + ' ' + element.lastName
      });



      hc.grammar = '#JSGF V1.0; grammar userNames; public <userName> = ' + hc.userNames.join(' | ') + ' ;'
      hc.buildPager();
      hc.micIsOn = false;
    });

    hc.buildPager = function () {
      hc.pagedSearchItems = [];
      hc.itemsPerPage = 8;
      hc.currentPage = 1;
      hc.figureOutItemsToDisplay();
    };

    hc.figureOutItemsToDisplay = function () {
      hc.filteredItems = $filter('filter')(hc.users, {
        $: hc.search
      });
      hc.filterLength = hc.filteredItems.length;
      var begin = ((hc.currentPage - 1) * hc.itemsPerPage);
      var end = begin + hc.itemsPerPage;
      hc.pagedSearchItems = hc.filteredItems.slice(begin, end);
    };

    hc.pageChanged = function () {
      hc.figureOutItemsToDisplay();
    };

    //speech recognition stuff starts here
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

    hc.SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    hc.SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
    hc.SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
    hc.recognition = new SpeechRecognition();
    hc.speechRecognitionList = new SpeechGrammarList();
    hc.speechRecognitionList.addFromString(hc.grammar, 1);
    hc.recognition.grammars = hc.speechRecognitionList;
    hc.recognition.lang = 'un-US';
    hc.recognition.interimResults = false;
    hc.recognition.maxAlternatives = 1;

    hc.webSpeech = function () {
      hc.recognition.start();
      console.log('Ready to receive voice command');
      hc.placeholder ="Please say the name of the person you would like to chat with";
      hc.micIsOn = true;
    };

    hc.recognition.onresult = function(event) {
      var last = event.results.length - 1;
      hc.micIsOn = true;
      hc.name = event.results[last][0].transcript;
      hc.vocalResponse = event.results;
      console.log(hc.name);
      $scope.$apply(function() {
        hc.search = hc.name;
        hc.figureOutItemsToDisplay();
      });
      hc.recognition.stop();
    };

    hc.Auth = Auth;

    hc.parallax = function() {
      $('.parallax').parallax()
    }

    hc.sideNav = function() {
      $('.button-collapse').sideNav({
        edge          : 'right',
        closeOnClick  : true,
        draggable     : true
      });
    }

    // hc.hideNav = function() {
    //   $('.button-collapse').sideNav('hide');
    // }

    $http.get('api/me')
      .then( function(resp){
        hc.Auth.user = resp.data;
        // if user is logged in then hc.Auth.user exists so push user to dashboard
        // if (hc.Auth.user  $location.url !== '/video-yak/') {
        //   console.log('$location: ', $location);
        //   $location.url('/dashboard');
        // }
        Socket.emit('signedIn', hc.Auth.user);
      })

    hc.logout = function() {
      $http.get('/logout')
        .then(function(){
          console.log("angular routing working");
          hc.Auth.user = null;
          $location.url('/');
        })
    }

  }
