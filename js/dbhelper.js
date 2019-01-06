var database = null;
var sql = require('sql.js');
var log = require('electron-log');
var fs = require('fs');


module.exports = {

    initRouteDatabase: function()
    {
        log.info("DB init!");
        if(database == null){
            // createNewDatabase();
            var filebuffer = fs.readFileSync('db.sqlite');
            database = new sql.Database(filebuffer);
            // saveDatabase();
            
            // log.debug(getAllRoutes());
        }
    },

    
    // returns value like: [ [id1, name1, notice1], [id2, name2, notice2] ]
    getAllRoutes: function(){
        var res = database.exec("SELECT * FROM `routes`;");
        if(res.length != 0){
            return res[0].values;
        }
        else return [];
    },

    //data example: [ name, notice ]
    insertRoute: function(route){
        database.run("INSERT INTO `routes` (`name`, `notice`) VALUES (\'" + route[0] + "\', \'" + route[1] + "\');");
    },

    //data example: [ name, notice ]
    saveRouteNotice: function(route){
        database.run("UPDATE `routes` SET `notice`=\'" + route[1] + "\' WHERE `name` = \'" + route[0] + "\';");
    },

    //returns true if name already exists, else false
    isRouteNameExists: function(name){
        var res = database.exec("SELECT `id` FROM `routes` WHERE `name` = \'" + name + "\';");
        if(res.length != 0){
            return true;
        }
        else return false;
    },

    // returns value like: [ [id1, routeid, x1, y1], [id2, routeid, x2, y2] ]
    getRoutePoints: function(name){
        var route = database.exec("SELECT `id` from `routes` WHERE `name` = \'" + name + "\';");
        if(route.length == 0){
            return false;
        }
        var routeId = route[0].values[0][0];
        var res = database.exec("SELECT * FROM `points` WHERE `route_id` = " + routeId + ";");
        if(res.length != 0){
            return res[0].values;
        }
        else return [];
    },
    
    //date format: name, [[x1, y1], [x2, y2]]
    //example:  "Route1", [[1.0, 1.0], [2.0, 2.0]]
    saveRoutePoints: function(name, points){
        var route = database.exec("SELECT `id` from `routes` WHERE `name` = \'" + name + "\';");
        if(route.length == 0){
            return false;
        }
        var id = route[0].values[0][0];
        database.run("DELETE FROM `points` WHERE `route_id` = \'" + id + "\';");
        query = "INSERT INTO `points` (`route_id`, `place`, `x`, `y`) VALUES ";
        for(i = 0; i<points.length; i++){
            str = "( " + points[i][0] + ", " + (i+1) + ", \'" + points[i][1] + "\', \'" + points[i][2] + "\')";
            if(i == points.length-1){
                str = str + ";";
            }
            else{
                str = str + ", ";
            }
            query = query + str;
        }
        database.run(query);
    },
    
    deleteRoute: function(name){
        var route = database.exec("SELECT `id` from `routes` WHERE `name` = \'" + name + "\';");
        if(route.length == 0){
            return false;
        }
        var id = route[0].values[0][0];
        database.run("DELETE FROM `routes` WHERE `id` = \'" + id + "\';");
        database.run("DELETE FROM `points` WHERE `route_id` = \'" + id + "\';");
    },
    
    //date format [route_id, place, x, y]
    //example [1, 2, 1.0, 1.0]
    insertPoint: function(point){
        var res = database.run("INSERT INTO `points` (`route_id`, `place`, `x`, `y`) VALUES (" + point[0] + ", " + point[1] + ", \'" + point[2] + "\', \'" + point[3] + "\');");
        log.debug("Insertion point result: ");
        log.debug(res);
    },
    
    //date format [x, y, notice]
    //example [1.0, 1.0, "This is notice"]
    setNotePointNotice: function(pointData){
        database.run("UPDATE `note_points` SET `notice`=\'" + pointData[2] + "\' WHERE `x` > \'" + (pointData[0]-0.00001) + "\' AND `x` < \'" + (pointData[0]+0.00001) + "\' AND `y` > \'" + (pointData[1]-0.00001) + "\' AND `y` < \'" + (pointData[1]+0.00001)+ "\';");
    },
    
    //date format [x, y, notice]
    //example [1.0, 1.0, "This is notice"]
    insertNotePoint: function(point){
        var res = database.run("INSERT INTO `note_points` (`x`, `y`, `notice`) VALUES (\'" + point[0] + "\', \'" + point[1] + "\', " + "\'" + point[2] + "\');");
        log.debug("Insertion point result: ");
        log.debug(res);
    },
    
    // //date format [x, y, notice]
    // //example [1.0, 1.0, "This is notice"]
    // deleteNotePoint:  function(id){
    //     database.run("DELETE FROM `note_points` WHERE `id` = \'" + id + "\';");
    // },
    
    //date format [x, y]
    //example [1.0, 1.0]
    deleteNotePoint:  function(coords){
        database.run("DELETE FROM `note_points` WHERE `x` > \'" + (coords[0]-0.00001) + "\' AND `x` < \'" + (coords[0]+0.00001) + "\' AND `y` > \'" + (coords[1]-0.00001) + "\' AND `y` < \'" + (coords[1]+0.00001)+ "\';");
    },

    dbClose: function(){
        if(database != null){
            saveDatabase();
            database.close();
            database = null;
        }
    },
    
    //date format [name, plate, consumption]
    //example ["Niva", "X967HP", 10.5]
    insertCar: function(car){
        database.run("INSERT INTO `cars` (`name`, `plate`, `consumption`) VALUES (\'" + car[0] + "\', \'" + car[1] + "\', \'" + car[2] + "\');");
    },

    deleteCar:  function(name){
        database.run("DELETE FROM `cars` WHERE `name` = \'" + name + "\';");
    },

    // returns value like: [ [id1, name1, plate1, comsumption1], [id2, name2, plate2, comsumption2] ]
    getAllCars: function(){
        var res = database.exec("SELECT * FROM `cars`;");
        if(res.length != 0){
            return res[0].values;
        }
        else return [];
    }
}

function saveDatabase(){
    var data = database.export();
    var buffer = Buffer.from(data);
    fs.writeFileSync("db.sqlite", buffer);
}

function createNewDatabase(){
    
    var db = new sql.Database();
    
    db.run("CREATE TABLE IF NOT EXISTS `routes` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` TEXT, `notice` TEXT);");
    db.run("CREATE TABLE IF NOT EXISTS `points` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `route_id` INTEGER NOT NULL, `x` REAL, `y` REAL, `place` INTEGER NOT NULL, FOREIGN KEY(`route_id`) REFERENCES routes(`id`));");
    db.run("CREATE TABLE IF NOT EXISTS `note_points` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `x` REAL, `y` REAL, `notice` TEXT);");
    db.run("CREATE TABLE IF NOT EXISTS `cars` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` TEXT, `plate` TEXT, `consumption` REAL);");
    db.run("CREATE TABLE IF NOT EXISTS `logs` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `description` TEXT, `time` TEXT);");
    
    var data = db.export();
    var buffer = Buffer.from(data);
    fs.writeFileSync("db.sqlite", buffer);
    log.info("Database was created!");
}