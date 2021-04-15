class Network {
    constructor(id, name, prefix, netmask){
        this.id = id;
        this.name = name;
        this.prefix = prefix;
        this.netmask = netmask;
    }

    setName(name){
        this.name = name;
    }

    setPrefix(prefix){
        this.prefix = prefix;
    }

    setNetmask(netmask){
        this.netmask = netmask;
    }

    getName(){
        return this.name;
    }

    getPrefix(){
        return this.prefix;
    }

    getNetmask(){
        return this.netmask;
    }

    getId(){
        return this.id;
    }
}