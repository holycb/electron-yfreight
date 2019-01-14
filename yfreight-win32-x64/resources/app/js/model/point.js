class Point{
    x = 0.0;
    y = 0.0;
    routeId = 0;
    id = 0;
    notice = "";

    constructor(routeId, x, y){
        this.routeId = routeId;
        this.y = y;
        this.x = x;
    }

    constructor(id, routeId, x, y, notice){
        this.routeId = routeId;
        this.y = y;
        this.x = x;
        this.id = id;
        this.routeId = routeId;
    }
}