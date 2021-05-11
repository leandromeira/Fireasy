class Host {
    constructor( name, ip, netmask){
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

}