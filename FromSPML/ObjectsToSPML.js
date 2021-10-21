function ObjectsToSPML(){
    spml = "";

    spml = spml.concat(objectFirewallToSPML());

    spml = spml.concat(objectInterfacesToSPML());

    spml = spml.concat(objectUnknownNetworkToSPML());

    spml = spml.concat(objectHostsToSPML());

    spml = spml.concat(objectNetworksToSPML());

    spml = spml.concat(objectHostListsToSPML());

    spml = spml.concat(objectIncomingTrafficsToSPML());

    spml = spml.concat(objectOutgoingTrafficsToSPML());

    spml = spml.concat(objectBlockTrafficsToSPML());

    return spml;
}

function objectFirewallToSPML(){
    spml = "fw("+firewall.getName()+","+firewall.getDefaultpolicy()+")";
    return spml;
}

function objectInterfacesToSPML(){
    spml = "";
    for(var i =0; i<interfaces.length; i++){
        spml = spml.concat("\nif("+interfaces[i].getName()+","+interfaces[i].getDeviceName()+","+
                interfaces[i].getIP()+","+interfaces[i].getNetmask()+","+interfaces[i].getFwname()+")");
    }
    return spml;
}

function objectUnknownNetworkToSPML(){
    spml = "";
    if(unknown_networks != null) 
        spml = "\nun(Internet)";
    return spml;
}

function objectHostsToSPML(){
    spml = "";
    if(hosts == null) return "";
    for(var i =0; i<hosts.length; i++){
        spml = spml.concat("\nht("+hosts[i].getName()+","+hosts[i].getIP()+","+
                hosts[i].getNetmask()+")");
    }
    return spml;
}

function objectNetworksToSPML(){
    spml = "";
    if(networks == null) return "";
    for(var i =0; i<networks.length; i++){
        spml = spml.concat("\nnet("+networks[i].getName()+","+networks[i].getPrefix()+","+
            networks[i].getNetmask()+")");
    }
    return spml;
}

function objectHostListsToSPML(){
    spml = "";
    if(hosts_list == null) return "";
    for(var i =0; i<hosts_list.length; i++){
        spml = spml.concat("\nhtl("+hosts_list[i].getName());
        for(var j =0; j<hosts_list[i].getHosts().length; j++){
            spml = spml.concat(","+hosts_list[i].getHosts()[j].getName());
        }
        spml = spml.concat(")");
    }
    return spml;
}

function objectIncomingTrafficsToSPML(){
    spml = "";
    if(incoming_traffics == null) return "";
    for(var i =0; i<incoming_traffics.length; i++){
        spml = spml.concat("\nit("+incoming_traffics[i].getId()+","+incoming_traffics[i].getName()+","+
                incoming_traffics[i].getAf()+","+incoming_traffics[i].getInterface().getName()+","+
                incoming_traffics[i].getExternEntity().getName()+","+
                incoming_traffics[i].getSourcePort()+","+incoming_traffics[i].getRedirectPort()+","+
                incoming_traffics[i].getProtocols()+")");
    }
    return spml;
}

function objectOutgoingTrafficsToSPML(){
    spml = "";
    if(outgoing_traffics == null) return "";
    for(var i =0; i<outgoing_traffics.length; i++){
        spml = spml.concat("\not("+outgoing_traffics[i].getName()+","+
                outgoing_traffics[i].getInterface().getName()+","+
                outgoing_traffics[i].getExternEntity().getName()+","+
                outgoing_traffics[i].getDestPort()+","+outgoing_traffics[i].getNat());
        for(var j=0;j<outgoing_traffics[i].getIncomingTraffics().length;j++){
            spml = spml.concat(","+outgoing_traffics[i].getIncomingTraffics()[j].getId());
        }
        spml = spml.concat(")");
    }
    return spml;
}

function objectBlockTrafficsToSPML(){
    spml = "";
    if(block_traffics == null) return "";
    for(var i =0; i<block_traffics.length; i++){
        spml = spml.concat("\nblk("+block_traffics[i].getId()+","+
                block_traffics[i].getName()+","+block_traffics[i].getAf()+","+
                block_traffics[i].getInterface().getName()+","+
                block_traffics[i].getExternEntitySource().getName()+","+
                block_traffics[i].getSourcePort()+","+block_traffics[i].getExternEntityDestiny().getName()+","+
                block_traffics[i].getDestPort()+","+block_traffics[i].getProtocols()+")");
    }
    return spml;
}