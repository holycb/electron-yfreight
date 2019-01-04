var database = null;
var sql = require('sql.js');
var log = require('electron-log');

function initData()
{
    document.write("shit");
    log.info("DB init!");
    if(database == null){
        database = new sql.Database();
        db.serialize(function(){
            db.run("CREATE TABLE IF NOT EXISTS `routes` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` TEXT, `notice` TEXT);");
            db.run("CREATE TABLE IF NOT EXISTS `points` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, FOREIGN KEY(`route_id`)"+
            +" REFERENCES routes(`id`), `x` REAL, `y` REAL, `notice` TEXT);");
            db.run("CREATE TABLE IF NOT EXISTS `logs` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `description` TEXT, `time` TEXT);");
            db.run("INSERT INTO `routes` (`name`, `notice`) VALUES ('Route1', 'Route1_Notice');");
        });
    }
}

function getAllRoutes(){
    db.serialize(function(){
        db.each("SELECT * FROM routes;", function(err, row) {
            log.info(row);
        });
    });
} 


function dbClose(){
    if(database != null){
        database.close();
        database = null;
    }
}