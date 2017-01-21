angular.module('Yakkee')
  .controller('homeController', homeController);

  homeController.$inject = ['$scope', '$http', '$location', '$filter', 'Auth', 'User', 'Socket'];

  function homeController($scope, $http, $location, $filter, Auth, User, Socket) {
    var hc = this;
    hc.placeholder = "With whom would you care to Yak?"

    hc.inviteReceived = false;

    hc.sendInvite = function (to, from) {
      console.log(`'sendInvite' function was triggered`);
      console.log(from.firstName + ' ' + from.lastName + ' to ' + to.firstName + ' ' + to.lastName);
       var roomName = 'room' + to._id;
       var inviteUrl = 'https://meet.jit.si/' + to._id;
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
    }

    Socket.on('beacon', function(){
      console.log('socket.io is working');
    })

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
      $location.url('/video-yak/' + rsvpReturned.sender._id + '_' + rsvpReturned.receiver._id);
    })

    hc.inviteAccepted = function(rsvp) {
      console.log('Invite from ' + rsvp.sender.firstName + ' ' + rsvp.sender.lastName + ' ' + rsvp.receiver.firstName + ' ' + rsvp.receiver.lastName + ' was accepted');
      hc.inviteReceived = false;
      Socket.broadcast.emit('yourInviteWasAccepted', rsvp);
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
      $('.button-collapse').sideNav();
    }

    hc.hideNav = function() {
      $('.button-collapse').sideNav('hide');
    }

    $http.get('api/me')
      .then( function(resp){
        hc.Auth.user = resp.data;
        // if user is logged in then hc.Auth.user exists so push user to dashboard
        // if (hc.Auth.user  $location.url !== '/video-yak/') {
        //   console.log('$location: ', $location);
        //   $location.url('/dashboard');
        // }
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
