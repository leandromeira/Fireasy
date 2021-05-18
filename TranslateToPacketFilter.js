var translated_rules = "";
function TranslateToPacketFilter(){
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
    for(var i=0;i<this.incoming_traffics.length;i++){
        translated_rules = translated_rules.concat(translateIncomingTrafficPF(this.incoming_traffics[i]));
    }
}

function translateIncomingTrafficPF(incoming_traffic){
    traffic = "pass in on "+incoming_traffic.getInterface().getDeviceName()+" "+
        incoming_traffic.getAf()+" proto { "+incoming_traffic.getProtocols()+" } from ";
    from = incoming_traffic.getExternEntity().constructor.name
    traffic = traffic.concat(translateIPs(from,incoming_traffic));
    if(incoming_traffic.getSourcePort() != "*"){
        traffic = traffic.concat(" port "+incoming_traffic.getSourcePort()+" to ")
    }
    outgoing_traffic = findOutTraffic(incoming_traffic);
    console.log(outgoing_traffic)
    to = outgoing_traffic.getExternEntity().constructor.name;
    traffic = traffic.concat(translateIPs(to,outgoing_traffic,traffic));
    if(outgoing_traffic.getDestPort() != "*"){
        traffic = traffic.concat(" port "+outgoing_traffic.getDestPort())
    }
    console.log(traffic);
    return traffic;
} 

function findOutTraffic(incoming_traffic){
    console.log(outgoing_traffics)
    for(var i=0;i<this.outgoing_traffics.length;i++){
        for(var j=0;j<this.outgoing_traffics[i].getIncomingTraffics().length;j++){
            if(outgoing_traffics[i].getIncomingTraffics()[j].getId() == incoming_traffic.getId()){
                return outgoing_traffics[i];
            }
        }            
    }
}

function translateIPs(direction, directed_traffic){
    IP="";
    switch (direction){
        case 'Host':
            IP = IP.concat(directed_traffic.getExternEntity().getIP());
            if(directed_traffic.getExternEntity().getIP()!= 'any'){
                IP = IP.concat("/"+directed_traffic.getExternEntity.getNetmask());
            }
            return IP;            
            break;
        case 'Network':
            IP = IP.concat(directed_traffic.getExternEntity().getPrefix()+"/"+directed_traffic.getExternEntity().getNetmask());
            return IP; 
            break;
        case 'Internet': 
            IP = IP.concat("any");
            return IP; 
            break;
        case 'Hosts': 
            IP = IP.concat("{ "+directed_traffic.getExternEntity().getHosts()[0].getIP());
            if(directed_traffic.getExternEntity().getHosts()[0].getIP()!= 'any'){
                IP = IP.concat("/"+directed_traffic.getExternEntity().getHosts()[0].getNetmask());
            }   
            for(var i=1;i<directed_traffic.getExternEntity().getHosts().length;i++){
                IP = IP.concat(", "+directed_traffic.getExternEntity().getHosts()[i].getIP());
                if(directed_traffic.getExternEntity().getHosts()[i].getIP()!= 'any'){
                    IP = IP.concat("/"+directed_traffic.getExternEntity().getHosts()[i].getNetmask());
                }            
            }
            IP = IP.concat(" }");
            return IP; 
            break;
        default: return;
    }
}