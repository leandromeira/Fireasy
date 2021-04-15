class UnknownNetwork {
    constructor(id,name){
        this.id = id;
        this.name = name;
    }

    setName(name){
        this.name = name;
    }

    getName(){
        return this.name;
    }

    getId(){
        return this.id;
    }
}