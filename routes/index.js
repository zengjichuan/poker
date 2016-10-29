var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('database.sqlite3');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

//router.get('/login', function(req, res, next){
//  res.render('login');
//});

router.post('/play', function(req, res, next){
    var user_name = req.body.name || '';
    var password = req.body.password || '';
    console.log(user_name + ' ' + password);

    db.get('SELECT psw FROM user WHERE id = ?', user_name, function(err, row) {
        if (!row || password != row.psw){
            res.status(400).send("用户名或密码错误！");
        }else{
            player1 = new player(1, [1,2,3], false);
            player2 = new player(2, [1,2,3], false);
            player3 = new player(3, [2,3,4], false);
            res.render('play', {players: [player1,player2,player3]});
        }
    });
});

function player(id, cards, sorted){
  this.id = id;
  this.cards = cards;
  this.sorted = sorted;
}

module.exports = router;
