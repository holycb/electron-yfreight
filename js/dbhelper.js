var database = null;
var sql = require('sql.js');
var log = require('electron-log');
var fs = require('fs');

function initRouteDatabase()
{
    log.info("DB init!");
    if(database == null){
        var filebuffer = fs.readFileSync('db.sqlite');
        database = new sql.Database(filebuffer);
    
        // database.run("INSERT INTO `routes` (`name`, `notice`) VALUES ('Route1', 'Route1_Notice');");
        getAllRoutes();
    }
}

function getAllRoutes(){
    var res = database.exec("SELECT * FROM routes");
    log.info(res[0].values);
} 

function insertRoute(name, notice){
    if(notice == null){
        notice="";
    }
    database.run("INSERT INTO `routes` (`name`, `notice`) VALUES (\'" + name + "\', \'" + notice + "\');");
}

function insertRoute(name){
    insertRoute(name, null);
}

function setRouteNotice(id, notice){
    database.run("UPDATE `routes` SET `notice`=\'" + notice + "\' WHERE `id` = " + id + ";");
}

function insertPoint(routeId, x, y, notice){
    if(notice == null){
        notice="";
    }
    var res = database.run("INSERT INTO `points` (`route_id`, `x`, `y`, `notice`) VALUES (" + routeId + ", " + x + ", " + y + ", \'" + notice + "\');");
    
    log.debug("Insertion point result: ");
    log.debug(res);
}

function insertPoint(routeId, x, y){
    insertPoint(routeId, x, y, null);
}

function setPointNotice(id, notice){
    database.run("UPDATE `points` SET `notice`=\'" + notice + "\' WHERE `id` = " + id + ";");
}

function dbClose(){
    if(database != null){
        saveDatabase();
        database.close();
        database = null;
    }
}

function getRoutePoints(routeId){
    var res = database.exec("SELECT * FROM `points` WHERE `route_id` = " + routeId + ";");
    var result = [];
    res[0].values.forEach(element => {
        result.push(PointConverter.convertValueIntoPoint(element));
    });
    return result;
} 

function saveDatabase(){
    var data = database.export();
    var buffer = Buffer.from(data);
    fs.writeFileSync("db.sqlite", buffer);
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