var database = null;
var sql = require('sql.js');
var log = require('electron-log');
var fs = require('fs');


module.exports = {

    initRouteDatabase: function()
    {
        log.info("DB init!");
        if(database == null){
            if(!fs.existsSync('db.sqlite')){
                createNewDatabase()
            }
            var filebuffer = fs.readFileSync('db.sqlite');
            database = new sql.Database(filebuffer);
            // 
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
    //return example: [ id, "name", "notice" ]
    insertRoute: function(route){
        database.run("INSERT INTO `routes` (`name`, `notice`) VALUES (\'" + route[0] + "\', \'" + route[1] + "\');");
        var res = database.exec("SELECT * FROM `routes` ORDER BY `id` DESC LIMIT 1;");
        if(res.length != 0){
            return res[0].values[0];
        }
        else return [];
    },

    //data example: [ id, notice ]
    saveRouteNotice: function(route){
        database.run("UPDATE `routes` SET `notice`=\'" + route[1] + "\' WHERE `id` = \'" + route[0] + "\';");
    },

    //returns true if name already exists, else false
    isRouteNameExists: function(name){
        var res = database.exec("SELECT `id` FROM `routes` WHERE `name` = \'" + name + "\';");
        if(res.length != 0){
            return true;
        }
        else return false;
    },

    // returns value like: [ [id1, routeid, x1, y1, place1], [id2, routeid, x2, y2, place2] ]
    getRoutePoints: function(routeId){
        var res = database.exec("SELECT * FROM `points` WHERE `route_id` = " + routeId + ";");
        if(res.length != 0){
            return res[0].values;
        }
        else return [];
    },
    
    //date format: id, [[x1, y1], [x2, y2]]
    //example:  5, [[1.0, 1.0], [2.0, 2.0]]
    saveRoutePoints: function(routeId, points){
        database.run("DELETE FROM `points` WHERE `route_id` = \'" + routeId + "\';");
        query = "INSERT INTO `points` (`route_id`, `place`, `x`, `y`) VALUES ";
        for(i = 0; i<points.length; i++){
            str = "( " + routeId + ", " + (i+1) + ", \'" + points[i][0] + "\', \'" + points[i][1] + "\')";
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
    
    deleteRoute: function(routeId){
        database.run("DELETE FROM `routes` WHERE `id` = \'" + routeId + "\';");
        database.run("DELETE FROM `points` WHERE `route_id` = \'" + routeId + "\';");
    },
    
    //date format [route_id, place, x, y]
    //example [1, 2, 1.0, 1.0]
    insertPoint: function(point){
        var res = database.run("INSERT INTO `points` (`route_id`, `place`, `x`, `y`) VALUES (" + point[0] + ", " + point[1] + ", \'" + point[2] + "\', \'" + point[3] + "\');");
        log.debug("Insertion point result: ");
        log.debug(res);
    },
    
    //date format [id, notice]
    //example [5, "This is notice"]
    setNotePointNotice: function(pointData){
        database.run("UPDATE `note_points` SET `notice`= \'" + pointData[1] + "\' WHERE `id` = " + pointData[0] + ";");
    },
    
    //date format [name, x, y, notice]
    //example ["name1", 1.0, 1.0, "This is notice"]
    insertNotePoint: function(point){
        var res = database.run("INSERT INTO `note_points` (`name`, `x`, `y`, `notice`) VALUES (\'" + point[0] + "\', \'" + point[1] + "\', \'" + point[2] + "\', \'" + point[3] + "\');");
        log.debug("Insertion point result: ");
        log.debug(res);
    },
    
    //date format: id
    deleteNotePoint:  function(id){
        database.run("DELETE FROM `note_points` WHERE `id` = " + id + ";");
    },

    // returns value like: [ {id: 1, name: "name1", note: "notice1", coords: [x1, y1]},
    // {id: 2, name: "name2", note: "notice2", coords: [x2, y2]} ]
    getNotePointsForMap: function(){
        var res = database.exec("SELECT * FROM `note_points`;");
        if(res.length != 0){
            var values = res[0].values;
            var result = [];
            values.forEach(element => {
                result.push({
                    id: element[0],
                    name: element[1],
                    note: element[4],
                    coords: [ element[2], element[3] ] 
                });
            });
            return result;
        }
        else return [];
    },

    // returns value like: [ [id1, "name1", "notice1"], [id2, "name2", "notice2"] ]
    getNotePoints: function(routeId){
        var res = database.exec("SELECT `id`, `name`, `notice` FROM `note_points`;");
        if(res.length != 0){
            return res[0].values;
        }
        else return [];
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


    //data format: id
    deleteCar: function(id){
        database.run("DELETE FROM `cars` WHERE `id` = \'" + id + "\';");
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


function test(){
}


function saveDatabase(){
    var data = database.export();
    var buffer = Buffer.from(data);
    fs.writeFileSync("db.sqlite", buffer);
    log.info("Database was saved!");
}

//date format [name, plate, consumption]
    //example ["Niva", "X967HP", 10.5]
function insertCar(car, db){
    db.run("INSERT INTO `cars` (`name`, `plate`, `consumption`) VALUES (\'" + car[0] + "\', \'" + car[1] + "\', \'" + car[2] + "\');");
}

function createNewDatabase(){
    
    var db = new sql.Database();
    
    db.run("CREATE TABLE IF NOT EXISTS `routes` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` TEXT, `notice` TEXT);");
    db.run("CREATE TABLE IF NOT EXISTS `points` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `route_id` INTEGER NOT NULL, `x` REAL, `y` REAL, `place` INTEGER NOT NULL, FOREIGN KEY(`route_id`) REFERENCES routes(`id`));");
    db.run("CREATE TABLE IF NOT EXISTS `note_points` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` TEXT, `x` REAL, `y` REAL, `notice` TEXT);");
    db.run("CREATE TABLE IF NOT EXISTS `cars` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` TEXT, `plate` TEXT, `consumption` REAL);");
    db.run("CREATE TABLE IF NOT EXISTS `logs` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `description` TEXT, `time` TEXT);");
    insertCar(["Chevrolet Niva", "H126PK", 11.0], db);
    insertCar(["Toyota Rav4", "A334AT", 7.5], db);
    insertCar(["Honda Stream", "X541OP", 8.1], db);
    insertCar(["Mazda Demio", "H908CB", 6.5], db);
    insertCar(["UAZ Patriot", "T131KM", 13.0], db);
    var data = db.export();
    var buffer = Buffer.from(data);
    fs.writeFileSync("db.sqlite", buffer);
    log.info("Database was created!");
}

