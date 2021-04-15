class StreamBlock {
    constructor(id, id_stream, name, ip_version, inter, extern_entity_source, source_port, extern_entity_destiny, dest_port, protocol, ){
        this.id = id;
        this.id_stream = id_stream;
        this.name = name;
        this.ip_version = ip_version;
        this.inter = inter;
        this.extern_entity_source = extern_entity_source;
        this.source_port = source_port;
        this.extern_entity_destiny = extern_entity_destiny;
        this.dest_port = dest_port;
        this.protocol = protocol;
        
    }

    setIdStream(id_stream){
        this.id_stream = id_stream;
    }

    setName(name){
        this.name = name;
    }

    setIpVersion(ip_version){
        this.ip_version = ip_version;
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

    setProtocol(protocol){
        this.protocol = protocol;
    }    

    getIdStream(){
        return this.id_stream;
    }

    getName(){
        return this.name;
    }

    getIpVersion(){
        return this.ip_version;
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

    getProtocol(){
        return this.protocol;
    }

    getId(){
        return this.id;
    }
   
}