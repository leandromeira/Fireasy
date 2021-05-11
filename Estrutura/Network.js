class Network {
    constructor(name, prefix, netmask){
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

}