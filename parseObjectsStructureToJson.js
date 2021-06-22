var key = -2
var json_rules ="";
function parseObjectsStructureToJson(){

    json_rules = generic_json_header_firewall;

    var firewall = firewallToJSON();
    if(firewall == null){
        alert("There is no default policy defined for firewall");
        return "";
    }     
    json_rules = json_rules.concat(firewall);

    
    var interfaces = interfacesToJSON();
    if(interfaces == null){
        alert("There is no interface defined for firewall");
        return "";
    } 
    json_rules = json_rules.concat(interfaces);
    
    var unknown_networks = unknownNetworkToJSON();
    json_rules = json_rules.concat(unknown_networks);
    
    var host = hostsToJSON();
    json_rules = json_rules.concat(host);

    var networks = networksToJSON();
    json_rules = json_rules.concat(networks);

    var host_lists = hostListsToJSON();
    json_rules = json_rules.concat(host_lists);

    json_rules = json_rules.concat(generic_json_link_array_header);

    //links

    var outgoing_traffics = outgoingTrafficsToJSON();
    json_rules = json_rules.concat(outgoing_traffics);

    var incoming_traffics = incomingTrafficsToJSON();
    json_rules = json_rules.concat(incoming_traffics);

    var block_traffics = blockTrafficsToJSON();
    json_rules = json_rules.concat(block_traffics);

    json_rules = json_rules.concat(generic_json_closing_chars);
    return json_rules;
}



function insertColors(){
    return ", \"Fill Color\":\"#282c34\", \"Stroke Color\":\"#00A9C9\", \"Text Color\":\"white\"}";
}

function firewallToJSON(){
    var fw = {
        "Default Policy": firewall.getDefaultpolicy()
    };
    json = JSON.stringify(fw);
    return(json.substring(1,json.length));
}

function interfacesToJSON(){
    var int="";
    if(interfaces.length==0) return null;
    for(var i=0;i<interfaces.length;i++){
        var obj = {
            "category": "Interface",
            "text": interfaces[i].getName(),
            "group": "-1",
            "Device Name": interfaces[i].getDeviceName(),
            "IP": interfaces[i].getIP(),
            "Netmask": interfaces[i].getNetmask(),
            "Firewall Name": interfaces[i].getFwname(),
            "key": key,
        }
        key--;
        int = int.concat(",\n");
        int = int.concat(JSON.stringify(obj));
        int = int.substring(0,int.length-1);
        int = int.concat(insertColors());
    }
    return int;
}

function unknownNetworkToJSON(){
    if(unknown_networks==null) return "";
    var un = "";
    var obj = {
        "category": "Internet",
        "text": unknown_networks.getName(),
        "key": key
    }
    key--;
    un = un.concat(",\n");
    un = un.concat(JSON.stringify(obj));
    un = un.substring(0,un.length-1);
    un = un.concat(insertColors());
    return un;
}

function hostsToJSON(){
    if(hosts.length==0) return "";
    var hts = "";
    for(var i=0;i<hosts.length; i++){
        var obj = {
            "category": "Host",
            "text": hosts[i].getName(),
            "IP": hosts[i].getIP(),
            "Netmask": hosts[i].getNetmask(),
            "key": key
        };
        key--;
        hts = hts.concat(",\n");
        hts = hts.concat(JSON.stringify(obj));
        hts = hts.substring(0,hts.length-1);
        hts = hts.concat(insertColors());
    }
    return hts;
}

function networksToJSON(){
    if(networks.length==0) return "";
    var net = "";
    for(var i=0;i<networks.length; i++){
        var obj = {
            "category": "Network",
            "text": networks[i].getName(),
            "Prefix": networks[i].getPrefix(),
            "Netmask": networks[i].getNetmask(),
            "key": key
        };
        key--;
        net = net.concat(",\n");
        net = net.concat(JSON.stringify(obj));
        net = net.substring(0,net.length-1);
        net = net.concat(insertColors());
    }
    return net;
}

function hostListsToJSON(){
    if(hosts_list.length==0) return "";
    var htl = "";
    for(var i=0;i<hosts_list.length; i++){
        var htl_names = [];
        for(var j=0;j<hosts_list[i].getHosts().length;j++){
            htl_names.push(hosts_list[i].getHosts()[j].getName());
        }
        var obj = {
            "category": "Hosts",
            "text": hosts_list[i].getName(),
            "Hosts": htl_names,
            "key": key
        };
        key--;
        htl = htl.concat(",\n");
        htl = htl.concat(JSON.stringify(obj));
        htl = htl.substring(0,htl.length-1);
        htl = htl.concat(insertColors());
    }
    return htl;
}

function outgoingTrafficsToJSON(){
    if(outgoing_traffics.length==0) return "";
    ot = "";
    for(var i=0;i<outgoing_traffics.length; i++){

        in_ids = [];
        in_txts = [];
        for(var j=0;j<outgoing_traffics[i].getIncomingTraffics().length;j++){
            in_ids.push(outgoing_traffics[i].getIncomingTraffics()[j].getId());
            in_txts.push(outgoing_traffics[i].getIncomingTraffics()[j].getId()+" | "+outgoing_traffics[i].getIncomingTraffics()[j].getName());
        }
            
        from_id = findIDfromObject(outgoing_traffics[i].getInterface());
        to_id = findIDfromObject(outgoing_traffics[i].getExternEntity());
        var nat, category = "TrafegoSaida";
        if(outgoing_traffics[i].getNat() == "") nat = false;
        else {
            nat = true;
            category = "TrafegoTraducao";
        }

        var obj = {
            "category": category, 
            "text": outgoing_traffics[i].getName()+" | "+in_ids, 
            "from": from_id, 
            "to": to_id, 
            "ID": traffic_out_ids,
            "Interface": outgoing_traffics[i].getInterface().getName(),
            "Extern Entity": outgoing_traffics[i].getExternEntity().getName(),
            "Destiny Port": outgoing_traffics[i].getDestPort(), 
            "NAT": nat,
            "Incoming Traffics": in_txts, 
            "ID_in": in_ids
        };
        traffic_out_ids++;
        if(i>0) ot = ot.concat(",\n");      
        ot = ot.concat(JSON.stringify(obj));
    }
    return ot;    
}

function incomingTrafficsToJSON(){
    if(incoming_traffics.length==0) return "";
    it = "";
    for(var i=0;i<incoming_traffics.length; i++){

        protos = incoming_traffics[i].getProtocols();
        protos = protos.split(",");
        from_id = findIDfromObject(incoming_traffics[i].getExternEntity());
        to_id = findIDfromObject(incoming_traffics[i].getInterface());
        var category = "TrafegoEntrada";
        if(incoming_traffics[i].getRedirectPort() != "") category = "TrafegoRedirecionamento";

        id_out = findID_outFromIncomingTraffic(incoming_traffics[i].getId());

        var obj = {
            "category": category, 
            "text": incoming_traffics[i].getId()+" | "+incoming_traffics[i].getName(), 
            "from": from_id, 
            "to": to_id, 
            "ID": incoming_traffics[i].getId(), 
            "Source Port": incoming_traffics[i].getSourcePort(), 
            "Redirect Port": incoming_traffics[i].getRedirectPort(), 
            "Protocols": protos, 
            "AF": incoming_traffics[i].getAf(), 
            "Interface": incoming_traffics[i].getInterface().getName(), 
            "External Entity": incoming_traffics[i].getExternEntity().getName(),
            "ID_out": id_out
        };
        it = it.concat(",\n");      
        it = it.concat(JSON.stringify(obj));
    }
    return it;    
}

function blockTrafficsToJSON(){
    if(block_traffics.length==0) return "";
    blk = "";
    for(var i=0;i<block_traffics.length; i++){

        protos = block_traffics[i].getProtocols();
        protos = protos.split(",");
        from_id = findIDfromObject(block_traffics[i].getExternEntitySource());
        to_id = findIDfromObject(block_traffics[i].getInterface());

        var obj = {
            "category":"TrafegoBloqueio",
            "text": block_traffics[i].getId()+" | "+block_traffics[i].getName(), 
            "from": from_id,
            "to": to_id,
            "ID": block_traffics[i].getId(),
            "AF": block_traffics[i].getAf(),
            "Interface": block_traffics[i].getInterface().getName(), 
            "Source Entity": block_traffics[i].getExternEntitySource().getName(),
            "Destiny Entity": block_traffics[i].getExternEntityDestiny().getName(),
            "Source Port": block_traffics[i].getSourcePort(),
            "Destiny Port": block_traffics[i].getDestPort(),
            "Protocols": protos
        };
        traffic_blk_ids++;
        blk = blk.concat(",\n");      
        blk = blk.concat(JSON.stringify(obj));
    }
    return blk;

}

function findIDfromObject(obj){
    var json = json_rules.concat(generic_json_closing_chars);
    json = JSON.parse(json);
    nodearray = json['nodeDataArray'];
    for(i=0;i<nodearray.length;i++){
        if(nodearray[i].text == obj.getName())
            return nodearray[i].key;
    }
}

function findID_outFromIncomingTraffic(id){
    var json = json_rules.concat(generic_json_closing_chars);
    json = JSON.parse(json);
    linkarray = json['linkDataArray'];
    for(i=0;i<linkarray.length;i++){
        if(linkarray[i].category != "TrafegoSaida" && linkarray[i].category != "TrafegoTraducao") continue;
            if(linkarray[i]["ID_in"].includes(id)) return linkarray[i].ID;
    }
    return null;
}