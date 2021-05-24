class BlockTraffic {
    constructor(id, name, af, inter, extern_entity_source, source_port, extern_entity_destiny, dest_port, protocols){
        this.id = id;
        this.name = name;
        this.af = af;
        this.inter = inter;
        this.extern_entity_source = extern_entity_source;
        this.source_port = source_port;
        this.extern_entity_destiny = extern_entity_destiny;
        this.dest_port = dest_port;
        this.protocols = protocols;
    }

    setName(name){
        this.name = name;
    }

    setAf(af){
        this.af = af;
    }

    setInterface(inter){
        this.interface = inter;
    }

    setExternEntitySource(extern_entity_source){
        this.extern_entity_source = extern_entity_source;
    }

    setSourcePort(source_port){
        this.source_port = source_port;
    }

    setExternEntityDestiny(extern_entity_destiny){
        this.extern_entity_destiny = extern_entity_destiny;
    }

    setDestPort(dest_port){
        this.dest_port = dest_port;
    }

    setProtocols(protocols){
        this.protocols = protocols;
    }    

    getName(){
        return this.name;
    }

    getAf(){
        return this.af;
    }

    getInterface(){
        return this.inter;
    }

    getExternEntitySource(){
        return this.extern_entity_source;
    }

    getSourcePort(){
        return this.source_port;
    }

    getExternEntityDestiny(){
        return this.extern_entity_destiny;
    }

    getDestPort(){
        return this.dest_port;
    }

    getProtocols(){
        return this.protocols;
    }

    getId(){
        return this.id;
    }
   
}