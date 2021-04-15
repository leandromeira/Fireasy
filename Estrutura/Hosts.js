class Hosts {
    constructor(id, name, hosts){
        this.id = id;
        this.name = name;
        this.hosts = hosts;
    }

    setName(name){
        this.name = name;
    }

    setHosts(hosts){
        this.hosts = hosts;
    }

    getName(){
        return this.name;
    }

    getHosts(){
        return this.hosts;
    }

    getId(){
        return this.id;
    }
}