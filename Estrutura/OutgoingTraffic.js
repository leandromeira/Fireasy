class OutgoingTraffic {
    constructor(name, inter, extern_entity, dest_port, nat, incoming_traffics){
        this.name = name;
        this.inter = inter;
        this.extern_entity = extern_entity;
        this.dest_port = dest_port;
        this.nat = nat;
        this.incoming_traffics = incoming_traffics;
    }

    setName(name){
        this.name = name;
    }

    setInterface(inter){
        this.inter = inter;
    }

    setExternEntity(extern_entity){
        this.extern_entity = extern_entity;
    }

    setDestPort(dest_port){
        this.dest_port = dest_port;
    }

    setNat(nat){
        this.nat = nat;
    }

    setIncomingTraffics(traffic_ids){
        this.incoming_traffics = incoming_traffics;
    }
    
    getName(){
        return this.name;
    }

    getInterface(){
        return this.inter;
    }

    getExternEntity(){
        return this.extern_entity;
    }

    getDestPort(){
        return this.dest_port;
    }

    getNat(){
        return this.nat;
    }

    getIncomingTraffics(){
        return this.incoming_traffics;
    }

}