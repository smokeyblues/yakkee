angular.module('Yakkee')
  .controller('homeController', homeController);

  homeController.$inject = ['$scope', '$http', '$location', '$filter', 'Auth', 'User'];

  function homeController($scope, $http, $location, $filter, Auth, User) {
    var hc = this;
    hc.placeholder = "With whom would you care to Yak?"

    User.query(function (data) {
      hc.users = data;
      // console.log(hc.users);
      hc.userNames = hc.users.map(function(element) {
        return element.firstName + ' ' + element.lastName
      });

      hc.inviteReceived = false;

      // hc.sendInvite = function (to, from) {
      //   console.log(from.displayName, 'to', to.displayName);
      //   var roomName = 'room' + to._id;
      //   var inviteUrl = 'https://meet.jit.si/' + from.firstName + from.lastName + 'meets' + to.firstName + to.lastName
      //   console.log(to);
      //   var inviteData = {
      //     sender: from,
      //     receiver: to,
      //     link: inviteUrl
      //   }
      //   Socket.emit('vcInviteReceived', inviteData);
      //   console.log('RoomName: ' + roomName);
      //
      // }

      // Socket.on('beacon', function(){
      //   console.log('socket.io is working');
      // })

      // Socket.on('triggerInvite', function(inviteData){
      //   console.log(inviteData);
      //   hc.inviteReceived = true;
      //   hc.invitation = inviteData;
      //   console.log(hc.invitation);
      // });

      // hc.inviteDenied = function() {
      //   hc.inviteReceived = false;
      // };

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
      console.log('figureOutItemsToDisplay ran');
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
