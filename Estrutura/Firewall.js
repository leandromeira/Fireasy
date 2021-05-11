class Firewall {
    constructor(name, defaultpolicy){
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
}