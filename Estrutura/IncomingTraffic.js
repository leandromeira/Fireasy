class IncomingTraffic {
    constructor(id, name, af, inter, extern_entity, source_port, redirect_port, protocols){
        this.id = id;
        this.name = name;
        this.af = af;
        this.inter = inter;
        this.extern_entity = extern_entity;
        this.source_port = source_port;
        this.redirect_port = redirect_port;
        this.protocols = protocols;
        
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

    setProtocols(protocols){
        this.protocols = protocols;
    }

    setAf(af){
        this.af = af;
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

    getProtocols(){
        return this.protocols;
    }

    getAf(){
        return this.af;
    }

    getId(){
        return this.id;
    }
}