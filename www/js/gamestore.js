angular.module('gameapp.gamestore',[])

  .factory('GameStore', function () {

    var games = [
      {
        id:'1',
        title:'The Witcher 3 : Wild Hunt',
        img:'img/game/witcher.png',
        year:'2000',
        rate:'5 étoiles'
      },
      {
        id:'2',
        title:'test2',
        img:'img/game/witcher.png',
        year:'2000',
        rate:'5 étoiles'
      },
      {
        id:'3',
        title:'test3',
        img:'img/game/witcher.png',
        year:'2000',
        rate:'5 étoiles'
      },
      {
        id:'4',
        title:'test4',
        img:'img/game/witcher.png',
        year:'2000',
        rate:'5 étoiles'
      },
      {
        id:'5',
        title:'test5',
        img:'img/game/witcher.png',
        year:'2000',
        rate:'5 étoiles'
      },
      {
        id:'6',
        title:'test6',
        img:'img/game/witcher.png',
        year:'2000',
        rate:'5 étoiles'
      }
    ];

    return{

      list: function () {
        return games;
      },

      getGame : function (gameId) {
        for (var i = 0; i < note.lenfth; i++) {
          if (game[i].id === gameId) {
            return games[i];
          }
        }
        return undefined
      },
      addGame: function(games){
        games.push(game)
      },

      removeGame: function (GameId) {
        for (var i = 0; i < note.lenfth; i++) {
          if (game[i].id === gameId) {
            games.splice(i,1);
            persist();
            return;
          }
        }
      }



    };

  });
