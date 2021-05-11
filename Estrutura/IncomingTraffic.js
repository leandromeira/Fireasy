class IncomingTraffic {
    constructor(id, id_stream, name, inter, extern_entity, source_port, redirect_port, protocol, ip_version){
        this.id = id;
        this.id_stream = id_stream;
        this.name = name;
        this.inter = inter;
        this.extern_entity = extern_entity;
        this.source_port = source_port;
        this.redirect_port = redirect_port;
        this.protocol = protocol;
        this.ip_version = ip_version;
    }

    setIdStream(id_stream){
        this.id_stream = id_stream;
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

    setSourcePort(source_port){
        this.source_port = source_port;
    }

    setRedirectPort(redirect_port){
        this.redirect_port = redirect_port;
    }

    setProtocol(protocol){
        this.protocol = protocol;
    }

    setIpVersion(ip_version){
        this.ip_version = ip_version;
    }

    getIdStream(){
        return this.id_stream;
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

    getSourcePort(){
        return this.source_port;
    }

    getRedirectPort(){
        return this.redirect_port;
    }

    getProtocol(){
        return this.protocol;
    }

    getIpVersion(){
        return this.ip_version;
    }

    getId(){
        return this.id;
    }
}