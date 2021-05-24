class Interface {
    constructor(name,devicename,ip,netmask,fwname){
        this.name = name;
        this.devicename = devicename;
        this.ip = ip;
        this.netmask = netmask;
        this.fwname = fwname;
    }

    setName(name){
        this.name = name;
    }

    setDeviceName(devicename){
        this.devicename = devicename;
    }

    setIP(ip){
        this.ip = ip;
    }

    setNetmask(netmask){
        this.netmask = netmask;
    }

    setFwname(fwname){
        this.fwname = fwname;
    }

    getName(){
        return this.name;
    }

    getDeviceName(){
        return this.devicename;
    }

    getIP(){
        return this.ip;
    }

    getNetmask(){
        return this.netmask;
    }

    getFwname(){
        return this.fwname;
    }
}