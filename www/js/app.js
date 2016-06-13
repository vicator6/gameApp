(function() {

  var gameapp = angular.module('gamexchange', ['ionic','firebase','ngCordova','gameapp.gamestore']);


  gameapp.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $stateProvider.state('home',{
      url:'/home',
      views: {
        'tab-home':{
          templateUrl:'templates/home.html'
        }
      }
    });

    $stateProvider.state('login',{
      url:'/login',
      views: {
        'tab-home':{
          templateUrl:'templates/login.html',
          controller:'LoginCtrl'
        }
      }
    });
    $stateProvider.state('signup',{
      url:'/signup',
      views: {
        'tab-home':{
          templateUrl:'templates/signup.html',
          controller:'LoginCtrl'
        }
      }
    });
    $stateProvider.state('signin',{
      url:'/signin',
      views: {
        'tab-home':{
          templateUrl:'templates/signin.html',
          controller:'LoginCtrl'
        }
      }
    });

    $stateProvider.state('chat',{
      url:'/chat',
      views: {
        'tab-home': {
          templateUrl: 'templates/chat.html',
          controller: 'ChatCtrl'
        }
      }
    });

    $stateProvider.state('mygames',{
      url:'/mygames',
      views: {
        'tab-mygames':{
          templateUrl:'templates/mygames.html',
          controller:'GamesCtrl'
        }
      }
    });

    $stateProvider.state('yourgames',{
      url:'/yourgames',
      views: {
        'tab-yourgames':{
          templateUrl:'templates/mygames.html',
          controller:'YourGamesCtrl'
        }
      }
    });

    $stateProvider.state('addgame',{
      url:'/addgame',
      views: {
        'tab-mygames': {
          templateUrl: 'templates/addgame.html',
          controller: 'AddGameCtrl'
        }
      }
    });

    $stateProvider.state('match',{
      url:'/match',
      views: {
        'tab-home': {
          templateUrl: 'templates/match.html',
          controller: 'MatchCtrl'
        }
      }
    });
    $stateProvider.state('friends',{
      url:'/friends',
      views: {
        'tab-home': {
          templateUrl: 'templates/friends.html',
          controller: 'FriendsCtrl'
        }
      }
    });

    $stateProvider.state('friendsgames',{
      url:'/friendsgames',
      views: {
        'tab-home': {
          templateUrl: 'templates/friendsgames.html',
          controller: 'FriendsGamesCtrl'
        }
      }
    });
    $stateProvider.state('settings',{
      url:'/settings',
      views: {
        'tab-home': {
          templateUrl: 'templates/settings.html',
          controller: 'SettingsCtrl'
        }
      }
    });

    $stateProvider.state('gameinfo',{
      url:'/gameinfo',
      views: {
        'tab-home': {
          templateUrl: 'templates/gameinfo.html',
          controller: 'GameInfoCtrl'
        }
      }
    });
    $stateProvider.state('mesexchange',{
      url:'/mesexchange',
      views: {
        'tab-home': {
          templateUrl: 'templates/mesexchange.html',
          controller: 'ExchangeCtrl'
        }
      }
    });

    $urlRouterProvider.otherwise('/home');

    $ionicConfigProvider.tabs.position('bottom');
  });

  gameapp.controller('LoginCtrl', ['$scope','$state', '$cordovaFacebook', function($scope, $state, $cordovaFacebook) {

    $scope.data = {};

    $scope.signupEmail = function(){

      var ref = new Firebase("https://burning-torch-6038.firebaseio.com");

      ref.createUser({
        email    : $scope.data.email,
        password : $scope.data.password
      }, function(error, userData) {
        if (error) {
          console.log("Error creating user:", error);
        } else {
          console.log("Successfully created user account with uid:", userData.uid);
          $state.go('login');
        }
      });
    };

    $scope.loginEmail = function(){

      var ref = new Firebase("https://burning-torch-6038.firebaseio.com");

      ref.authWithPassword({
        email    : $scope.data.email,
        password : $scope.data.password
      }, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
        }
      });

    };

    $scope.loginFacebook = function(){

      var ref = new Firebase("https://burning-torch-6038.firebaseio.com");


      if(ionic.Platform.isWebView()){

        $cordovaFacebook.login(["public_profile", "email"]).then(function(success){

          console.log(success);

          ref.authWithOAuthToken("facebook", success.authResponse.accessToken, function(error, authData) {
            if (error) {
              console.log('Firebase login failed!', error);
            } else {
              console.log('Authenticated successfully with payload:', authData);
            }
          });

        }, function(error){
          console.log(error);
        });

      }
      else {

        ref.authWithOAuthPopup("facebook", function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
          }
        });

      }

    };

  }]);


  gameapp.controller('ChatCtrl', ['$scope', '$stateParams','$firebaseArray', '$state', function($scope,$stateParams,$firebaseArray, $state) {

    $scope.conversation = $stateParams.conversation;
    $scope.user = $stateParams.user;
    // on créer une connexion à notre base de donnée Firebase
    var ref = new Firebase("https://supchatarticle.firebaseio.com/chat");
    // on prend toutes les conversations qui ont comme nom celui que l'utilisateur a rentré dans le formulaire
    // et qui est passé en paramètre :
    var query = ref.orderByChild("conversation").startAt($scope.conversation).endAt($scope.conversation);
    // la variable message est un Firebase Array
    // c'est un tableau avec tous les messages qui sont dans la base de donnée
    // l'avantage du FirebaseArray c'est que ce tableau est synchronisé en temps réél et
    // il est mis à jours à chaques fois qu'un élément est ajouté à la conversation :
    $scope.messages = $firebaseArray(query);
    // quand on reçoit un message, on joue une musique
    ref.on('child_added', function(snap) {
      var newMessage = snap.val();
      if (newMessage.user != $scope.user){
        var audio = new Audio('js/message.mp3');
        audio.play();
      };
    });
    // quand l'utilisateur clique sur envoyer
    // on ajoute le message dans la base de donnée Firebase
    $scope.add = function(add){
      $scope.messages.$add({
        "conversation": $scope.conversation,
        "date": new Date().getTime(),
        "user": $scope.user,
        "content": add.message
      });
      $scope.add.message = "";
    };
    // quand l'utilisateur clique sur le bouton de déconnexion
    // on le redirige vers le page d'accueil
    $scope.logOut = function(){
      $state.go('friendsgames');
    };

  }]);

  gameapp.controller('AddGameCtrl', ['$scope','$state','GameStore',  function($scope,$state, GameStore) {

    $scope.games = GameStore.list();

    $scope.titleSearch = '';

    $scope.game = {
      id:new Date().getTime.toString(),
      title:'',
      year:'',
      rate:''
    };

    $scope.addGames = function () {
      GameStore.addGame($scope.game);

    };

  }]);

  gameapp.controller('GamesCtrl', ['$scope','GameStore','$state', function($scope,GameStore,$state) {

    $scope.gotogaminfo = function () {
      $state.go('gameinfo');
    };

    $scope.removeGame = function (gameId) {
      GameStore.remove(note.id);
    };

    $scope.buttonColor = "button-balanced";

    $scope.listItemColor = "ItemBgColorGreen";

    $scope.changeButtonColor = function () {
      if($scope.buttonColor === "button-balanced"){
        $scope.buttonColor = "button-assertive";
        $scope.listItemColor = "ItemBgColorRed";
      }
      else{
        $scope.buttonColor = "button-balanced";
        $scope.listItemColor = "ItemBgColorGreen";
      }
    };

    $scope.games = GameStore.list();

  }]);

  gameapp.controller('YourGamesCtrl', ['$scope','GameStore', function($scope,GameStore) {

    $scope.removeGame = function (gameId) {
      GameStore.remove(note.id);
    };

    $scope.buttonColor = "button-balanced";

    $scope.listItemColor = "ItemBgColorGreen";

    $scope.changeButtonColor = function () {
      if($scope.buttonColor === "button-balanced"){
        $scope.buttonColor = "button-assertive";
        $scope.listItemColor = "ItemBgColorRed";
      }
      else{
        $scope.buttonColor = "button-balanced";
        $scope.listItemColor = "ItemBgColorGreen";
      }
    };

    $scope.games = GameStore.list();

  }]);

  gameapp.controller('FriendsCtrl', ['$scope', function($scope) {

  }]);

  gameapp.controller('FriendsGamesCtrl', ['$scope', function($scope) {

  }]);

  gameapp.controller('GameInfoCtrl', ['$scope', function($scope) {

  }]);

  gameapp.controller('MatchCtrl', ['$scope', function($scope) {

  }]);

  gameapp.controller('ExchangeCtrl', ['$scope', function($scope) {

  }]);
  gameapp.controller('SettingsCtrl', ['$scope', function($scope) {

  }]);
  



  gameapp.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });

}());
