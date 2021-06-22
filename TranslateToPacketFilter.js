var translated_rules = "";
function TranslateToPacketFilter(){
    translated_rules = "";
    translateDefaultPolicy();
    translateTrafficsPF();

    return translated_rules;
}

function translateDefaultPolicy(){
    translated_rules = translated_rules.concat("# Default Policy\n");
    if(firewall.getDefaultpolicy() == "block"){
        translated_rules = translated_rules.concat("block in all\n")
        return;
    }
    translated_rules = translated_rules.concat("pass in all\n")
    return;
}
    
function translateTrafficsPF(){
    if(incoming_traffics){
        for(var i=0;i<this.incoming_traffics.length;i++){
            translated_rules = translated_rules.concat(translateIncomingTrafficPF(this.incoming_traffics[i]));
        }
    }
    if(outgoing_traffics){
        for(var i=0;i<this.outgoing_traffics.length;i++){
            translated_rules = translated_rules.concat(translateOutgoingTrafficPF(this.outgoing_traffics[i]));
        }
    }    
    if(block_traffics){
        for(var i=0;i<this.block_traffics.length;i++){
            translated_rules = translated_rules.concat(translateBlockTrafficPF(this.block_traffics[i]));
        }
    }
}

function translateIncomingTrafficPF(incoming_traffic){
    if(incoming_traffic.getRedirectPort() == ""){
        outgoing_traffic = findOutTraffic(incoming_traffic);
        if(typeof outgoing_traffic == "undefined") return "";
        var traffic = "pass in on "+incoming_traffic.getInterface().getDeviceName()+" "+
            incoming_traffic.getAf()+" proto { "+incoming_traffic.getProtocols()+" } from ";
        from = incoming_traffic.getExternEntity().constructor.name;
        traffic = traffic.concat(translateIPs(from,incoming_traffic.getExternEntity()));
        if(incoming_traffic.getSourcePort() != "*"){
            traffic = traffic.concat(" port "+incoming_traffic.getSourcePort());
        }
        traffic = traffic.concat(" to ");
        
        to = outgoing_traffic.getExternEntity().constructor.name;
        traffic = traffic.concat(translateIPs(to,outgoing_traffic.getExternEntity()));
        if(outgoing_traffic.getDestPort() != "*"){
            traffic = traffic.concat(" port "+outgoing_traffic.getDestPort())
        }
        traffic = traffic.concat("\n");
        return traffic;
    }

    //é um tráfego de redirecionamento

    var traffic = "pass in on "+incoming_traffic.getInterface().getDeviceName()+" "+
            incoming_traffic.getAf()+" proto { "+incoming_traffic.getProtocols()+" } from ";
        from = incoming_traffic.getExternEntity().constructor.name;
        traffic = traffic.concat(translateIPs(from,incoming_traffic.getExternEntity()));
        if(incoming_traffic.getSourcePort() != "*"){
            traffic = traffic.concat(" port "+incoming_traffic.getSourcePort());
        }
        traffic = traffic.concat(" to ");
        to = incoming_traffic.getInterface().constructor.name;
        traffic = traffic.concat(translateIPs(to,incoming_traffic.getInterface()));
        traffic = traffic.concat(" port "+incoming_traffic.getRedirectPort());
        traffic = traffic.concat(" rdr-to ");
        outgoing_traffic = findOutTraffic(incoming_traffic);     
        rdr = outgoing_traffic.getExternEntity().constructor.name;
        traffic = traffic.concat(translateIPs(rdr,outgoing_traffic.getExternEntity()));
        if(outgoing_traffic.getDestPort() != "*"){
            traffic = traffic.concat(" port "+outgoing_traffic.getDestPort())
        }
        traffic = traffic.concat("\n");
        return traffic;
} 

function translateOutgoingTrafficPF(outgoing_traffic){
    var traffic = "";
    if(outgoing_traffic.getIncomingTraffics().length == 0) return "";
    for(var i=0;i<outgoing_traffic.getIncomingTraffics().length;i++){
        incoming_traffic = outgoing_traffic.getIncomingTraffics()[i];
        traffic = traffic.concat("pass out on "+outgoing_traffic.getInterface().getDeviceName()+" "+
            incoming_traffic.getAf()+" proto { "+incoming_traffic.getProtocols()+" } from ");
        from = incoming_traffic.getExternEntity().constructor.name;
        traffic = traffic.concat(translateIPs(from,incoming_traffic.getExternEntity()));
        if(incoming_traffic.getSourcePort() != "*"){
            traffic = traffic.concat(" port "+incoming_traffic.getSourcePort());
        }
        traffic = traffic.concat(" to ");
        to = outgoing_traffic.getExternEntity().constructor.name;
        traffic = traffic.concat(translateIPs(to,outgoing_traffic.getExternEntity()));
        if(outgoing_traffic.getDestPort() != "*"){
            traffic = traffic.concat(" port "+outgoing_traffic.getDestPort())
        }
        if(outgoing_traffic.getNat()!= ""){
            traffic = traffic.concat(" nat-to ("+outgoing_traffic.getInterface().getDeviceName()+")")
        }
        traffic = traffic.concat("\n");
    }
    return traffic;
}

function translateBlockTrafficPF(block_traffic){
    var traffic = "block in on "+block_traffic.getInterface().getDeviceName()+" "+
        block_traffic.getAf()+" proto { "+block_traffic.getProtocols()+" } from ";
    from = block_traffic.getExternEntitySource().constructor.name;
    traffic = traffic.concat(translateIPs(from,block_traffic.getExternEntitySource()));
    if(block_traffic.getSourcePort() != "*"){
        traffic = traffic.concat(" port "+block_traffic.getSourcePort());
    }
    traffic = traffic.concat(" to ");
    to = block_traffic.getExternEntityDestiny().constructor.name;
    traffic = traffic.concat(translateIPs(to,block_traffic.getExternEntityDestiny()));
    if(block_traffic.getDestPort() != "*"){
        traffic = traffic.concat(" port "+block_traffic.getDestPort())
    }
    traffic = traffic.concat("\n");
    return traffic;
}

function findOutTraffic(incoming_traffic){
    for(var i=0;i<this.outgoing_traffics.length;i++){
        for(var j=0;j<this.outgoing_traffics[i].getIncomingTraffics().length;j++){
            if(outgoing_traffics[i].getIncomingTraffics()[j].getId() == incoming_traffic.getId()){
                return outgoing_traffics[i];
            }
        }            
    }
}

function translateIPs(direction, entity){
    IP="";
    switch (direction){
        case 'Host':
            IP = IP.concat(entity.getIP());
            IP = IP.concat("/"+entity.getNetmask());
            return IP;            
            break;
        case 'Network':
            IP = IP.concat(entity.getPrefix()+"/"+entity.getNetmask());
            return IP; 
            break;
        case 'UnknownNetwork': 
            IP = IP.concat("any");
            return IP; 
            break;
        case 'Hosts':      
            IP = IP.concat("{ ");
            for(var i=0;i<entity.getHosts().length;i++){
                IP = IP.concat(entity.getHosts()[i].getIP()+
                    "/"+entity.getHosts()[i].getNetmask());     
                if(i!=(entity.getHosts().length-1)) IP = IP.concat(", ");
            }
            IP = IP.concat(" }");
            return IP; 
            break;
        case 'Interface':
            IP = IP.concat(entity.getIP());
            IP = IP.concat("/"+entity.getNetmask());
            return IP;            
            break;
        default: return;
    }
}

