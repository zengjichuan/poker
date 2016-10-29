/**
 * Created by JC on 2016/10/29.
 */

var crypto = require('crypto');
var sqlite3 = require('sqlite3');

var db = new sqlite3.Database('../../database.sqlite3');


db.serialize(function(){
    //db.run("DROP TABLE user");
    db.run("CREATE TABLE user (id TEXT, psw TEXT)");
    var stmt = db.prepare("INSERT INTO user VALUES (?,?)");
    stmt.run("abcd", "1234");
    stmt.run("asdf", "1234");
    stmt.finalize();
    db.each("SELECT id, psw FROM user", function(err, row){
        console.log("User id: " + row.id + "  Psw: "+row.psw);
    });
});
db.close();

