class OutgoingTraffic {
    constructor(id, name, inter, extern_entity, dest_port, network_translate, traffic_ids){
        this.id = id;
        this.name = name;
        this.inter = inter;
        this.extern_entity = extern_entity;
        this.dest_port = dest_port;
        this.network_translate = network_translate;
        this.traffic_ids = traffic_ids;
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

    setNetworkTranslate(network_translate){
        this.network_translate = network_translate;
    }

    setTrafficIds(traffic_ids){
        this.traffic_ids = traffic_ids;
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

    getNetworkTranslate(){
        return this.network_translate;
    }

    getTrafficIds(){
        return this.traffic_ids;
    }

    getId(){
        return this.id;
    }
}