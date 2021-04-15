class Host {
    constructor(id, name, ip, netmask){
        this.id = id;
        this.name = name;
        this.ip = ip;
        this.netmask = netmask;
    }

    setName(name){
        this.name = name;
    }

    setIP(ip){
        this.ip = ip;
    }

    setNetmask(netmask){
        this.netmask = netmask;
    }

    getName(){
        return this.name;
    }

    getIP(){
        return this.ip;
    }

    getNetmask(){
        return this.netmask;
    }

    getId(){
        return this.id;
    }
}