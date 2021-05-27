var spml;

function translateMetaSPML(json){
    jsonparsed = JSON.parse(json)
    spml = translateFirewall(jsonparsed);
    spml = spml.concat(translateInterfaces(jsonparsed));
    spml = spml.concat(translateHosts(jsonparsed));
    spml = spml.concat(translateInternets(jsonparsed));
    spml = spml.concat(translateNetworks(jsonparsed));
    spml = spml.concat(translateHostsList(jsonparsed));
    spml = spml.concat(translateIncomingTraffic(jsonparsed));
    spml = spml.concat(translateOutgoingTraffic(jsonparsed));
    spml = spml.concat(translateBlockTraffic(jsonparsed));

    return spml;
}

function translateFirewall(json){
    nodearray = json['nodeDataArray'];
    for(i=0;i<nodearray.length;i++){
        if(nodearray[i].category == "Firewall") {
            fw = "fw("+nodearray[i].text+","+nodearray[i]["Default Policy"]+")\n";
            return fw;
        }
    }
}

function translateInterfaces(json){
    nodearray = json['nodeDataArray'];
    interfaces = "";
    for(i=0;i<nodearray.length;i++){
        if(nodearray[i].category == "Interface") {
            interfaces = interfaces.concat("if("+nodearray[i].text+","+nodearray[i]["Device Name"]+","+nodearray[i]["IP"]+
                ","+nodearray[i]["Netmask"]+","+nodearray[i]["Firewall Name"]+")\n");
        }
    }
    return interfaces;
}

function translateHosts(json){
    nodearray = json['nodeDataArray'];
    hosts = "";
    for(i=0;i<nodearray.length;i++){
        if(nodearray[i].category == "Host") {
            hosts = hosts.concat("ht("+nodearray[i].text+","+nodearray[i]["IP"]+","+nodearray[i]["Netmask"]+")\n");
        }
    }
    return hosts;
}

function translateInternets(json){
    nodearray = json['nodeDataArray'];
    internets = "";
    for(i=0;i<nodearray.length;i++){
        if(nodearray[i].category == "Internet") {
            internets = internets.concat("un("+nodearray[i].text+")\n");
        }
    }
    return internets;
}

function translateNetworks(json){
    nodearray = json['nodeDataArray'];
    networks = "";
    for(i=0;i<nodearray.length;i++){
        if(nodearray[i].category == "Network") {
            networks = networks.concat("net("+nodearray[i].text+","+nodearray[i]["Prefix"]+","+nodearray[i]["Netmask"]+")\n");
        }
    }
    return networks;
}

function translateHostsList(json){
    nodearray = json['nodeDataArray'];
    hostslist = "";
    for(i=0;i<nodearray.length;i++){
        if(nodearray[i].category == "Hosts") {
            hostslist = hostslist.concat("htl("+nodearray[i].text);
            for(j=0;j<nodearray[i]["Hosts"].length;j++){
                hostslist = hostslist.concat(","+nodearray[i]["Hosts"][j]);
            }
            hostslist = hostslist.concat(")\n");
        }
    }
    return hostslist;
}

function translateIncomingTraffic(json){
    linkarray = json['linkDataArray'];
    linkslist = "";
    for(i=0;i<linkarray.length;i++){
        if(linkarray[i].category == "TrafegoEntrada" || linkarray[i].category == "TrafegoRedirecionamento") {
            interface = myDiagram.findNodeForKey(linkarray[i].to);
            from = myDiagram.findNodeForKey(linkarray[i].from);
            text = linkarray[i].text.split("|");
            text = text[1];
            text = text.substring(1, text.length);
            linkslist = linkslist.concat("it("+linkarray[i].ID+","+text+","+linkarray[i].AF+","+
                interface.data.text+","+from.data.text+","+linkarray[i]["Source Port"]+","+linkarray[i]["Redirect Port"]);
            for(j=0;j<linkarray[i]["Protocols"].length;j++){
                linkslist = linkslist.concat(","+linkarray[i]["Protocols"][j].toLowerCase())
            }
            linkslist = linkslist.concat(")\n");
        }
    }
    return linkslist;
}

function translateBlockTraffic(json){
    linkarray = json['linkDataArray'];
    linkslist = "";
    for(i=0;i<linkarray.length;i++){
        if(linkarray[i].category == "TrafegoBloqueio") {
            interface = myDiagram.findNodeForKey(linkarray[i].to);
            from = myDiagram.findNodeForKey(linkarray[i].from);
            text = linkarray[i].text.split("|");
            text = text[1];
            text = text.substring(1, text.length);
            linkslist = linkslist.concat("blk("+linkarray[i].ID+","+text+","+linkarray[i].AF+","+
                interface.data.text+","+from.data.text+","+linkarray[i]["Source Port"]+","+linkarray[i]["Destiny Entity"]+
                ","+linkarray[i]["Destiny Port"]);
            for(j=0;j<linkarray[i]["Protocols"].length;j++){
                linkslist = linkslist.concat(","+linkarray[i]["Protocols"][j].toLowerCase())
            }
            linkslist = linkslist.concat(")\n");
        }
    }
    return linkslist;
}

function translateOutgoingTraffic(json){
    linkarray = json['linkDataArray'];
    linkslist = "";
    for(i=0;i<linkarray.length;i++){
        if(linkarray[i].category == "TrafegoSaida" || linkarray[i].category == "TrafegoTraducao") {
            interface = myDiagram.findNodeForKey(linkarray[i].from);
            to = myDiagram.findNodeForKey(linkarray[i].to);
            var text = linkarray[i].text;
            if(linkarray[i].text.includes("|")){
                text = linkarray[i].text.split("|");
                text = text[0];
                text = text.substring(0, text.length-1)
            }            
            linkslist = linkslist.concat("ot("+text+","+interface.data.text+","+to.data.text+","+
                linkarray[i]["Destiny Port"]);
            if(linkarray[i]["NAT"]==true) linkslist = linkslist.concat(",nat");
            else linkslist = linkslist.concat(",");
            for(j=0;j<linkarray[i]["Incoming Traffics"].length;j++){
                linkslist = linkslist.concat(","+linkarray[i]["Incoming Traffics"][j].substr(0,linkarray[i]["Incoming Traffics"][j].indexOf(" ")))
            }
            linkslist = linkslist.concat(")\n");
        }
    }
    return linkslist;
}
