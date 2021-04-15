class Firewall {
    constructor(id, name, defaultpolicy){
        this.id = id;
        this.name = name;
        this.defaultpolicy = defaultpolicy;
    }

    setName(name){
        this.name = name;
    }
    setDefaultpolicy(defaultpolicy){
        this.defaultpolicy = defaultpolicy;
    }

    getName(){
        return this.name;
    }

    getDefaultpolicy(){
        return this.defaultpolicy;
    }

    getId(){
        return this.id;
    }

}