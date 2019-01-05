class Route{
    id = 0;
    name = "";
    notice = "";

    constructor(name){
        this.name = name;
    }

    constructor(id, name, notice){
        this.id = id;
        this.name = name;
        this.notice = notice;
    }
    
}