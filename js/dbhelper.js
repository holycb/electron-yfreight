var database = null;
var sql = require('sql.js');
var log = require('electron-log');
var fs = require('fs');

function initDatabaseOfDataDD()
{
    log.info("DB init!");
    if(database == null){
        var filebuffer = fs.readFileSync('db.sqlite');
        database = new sql.Database(filebuffer);
    
        // database.run("INSERT INTO `routes` (`name`, `notice`) VALUES ('Route1', 'Route1_Notice');");
        getAllRoutes();
        // var data = database.export();
        // var buffer = Buffer.from(data);
        // fs.writeFileSync("db.sqlite", buffer);
    }
}

function getAllRoutes(){
    var res = database.exec("SELECT * FROM routes");
    log.info(res[0].values);
} 


function dbClose(){
    if(database != null){
        var data = database.export();
        var buffer = Buffer.from(data);
        fs.writeFileSync("db.sqlite", buffer);
        database.close();
        database = null;
    }
}

function createNewDatabase(){
    
    var db = new sql.Database();
    
    db.run("CREATE TABLE IF NOT EXISTS `routes` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` TEXT, `notice` TEXT);");
    db.run("CREATE TABLE IF NOT EXISTS `points` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `route_id` INTEGER NOT NULL, `x` REAL, `y` REAL, `notice` TEXT, FOREIGN KEY(`route_id`) REFERENCES routes(`id`));");
    db.run("CREATE TABLE IF NOT EXISTS `logs` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `description` TEXT, `time` TEXT);");
    
    var data = database.export();
    var buffer = Buffer.from(data);
    fs.writeFileSync("db.sqlite", buffer);
    log.info("Database was created!");
}