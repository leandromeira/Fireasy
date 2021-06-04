function ObjectifyPacketFilter(rules){
    redefineStructureObjects();
    redefineCounters();
    redefineTrafficIDSCounters();

    firewall = objectifyFirewall(rules);
    if(firewall == null){
        alert("There is no default policy defined for firewall");
        return null;
    }     
    console.log(firewall);

    interfaces = objectifyInterfaces(rules);
    if(interfaces == null){
        alert("There are no interfaces defined for firewall");
        return null;
    }     
    console.log(interfaces);

    unknown_networks = objectifyUnknownNetwork(rules);
    console.log(unknown_networks)

    objectifyEntities(rules);

    incoming_traffics = objectifyIncomingTraffics(rules);

    return true;
}

function objectifyFirewall(lines){
    var policy="";
    for(var i=0; i<lines.length;i++){
        if(lines[i].includes("all")){
            p = lines[i].split(" ");
            for(var j=0; j<p.length;j++){
                if(p[j] == "") p.splice(j,1);
            }
            var policy = p[0].toLowerCase();
            lines = lines.splice(i,1);
            break;
        }
    }
    if(policy == "") {
        return null;
    }
    return new Firewall("Firewall",policy);
}

function objectifyInterfaces(lines){
    var ints = [];
    var interfaces = [];
    for(var i=0; i<lines.length;i++){
        int_name = lines[i].split(" ")[3];
        if(!ints.includes(int_name)){
            ints.push(int_name);
            interfaces.push(new Interface(int_name,int_name,"","","Firewall"));
        }
    }
    if(interfaces.length ==0) return null;
    return interfaces;
}

function objectifyUnknownNetwork(lines){
    for(var i=0; i<lines.length;i++){
        if(lines[i].includes("any")){
            var unknown = new UnknownNetwork("Internet");
            return unknown;
        }
    }
}

function objectifyEntities(lines){
    var ips = [];
    for(var i=0; i<lines.length; i++){
        fromip = getFromIP(lines[i]);
        if(fromip != "any") ips.push(fromip);
        toip = getToIP(lines[i]);
        if(toip != "any") ips.push(toip);
        rdrip = getRdrIP(lines[i]);
        if(rdrip != null) ips.push(rdrip);
    }
    networks = objectifyNetworks(ips);
    hosts = objectifyHosts(ips);
    hosts_list = objectifyHostsList(ips)

    console.log(networks);
    console.log(hosts);
    console.log(hosts_list);
}

function getFromIP(line){
    var ip = "";
    var from = line.split("from")[1];
    from = from.split("to")[0];
    if(from.includes("port")){
        from = from.split("port")[0];
    }
    from = from.replace(/\s/g, '');
    return from;
}

function getToIP(line){
    var ip = "";
    var to = line.split(" to ")[1];
    if(to.includes("port")){
        to = to.split("port")[0];
    }
    if(to.includes("nat")){
        to = to.split("nat")[0];
    }
    if(to.includes("rdr")){
        to = to.split("rdr")[0];
    }
    to = to.replace(/\s/g, '');
    console.log(to)
    return to;
}

function getRdrIP(line){
    var ip = "";
    var rdr = line.split(" to ")[1];
    if(!rdr.includes("rdr")) return null;
    rdr = rdr.split("rdr")[1];
    rdr =  rdr.split("to")[1];
    rdr = rdr.split("port")[0];
    rdr = rdr.replace(/\s/g, '');
    return rdr;    
}

function objectifyNetworks(ips){
    var nets=[];
    loop1: for(var i=0; i<ips.length;i++){
        if(ips[i].includes("{")) continue;
        ip = ips[i].split("/")[0];
        netmask = ips[i].split("/")[1];
        last_piece_ip = ip.split(".");
        last_piece_ip = last_piece_ip[last_piece_ip.length-1];
        if(last_piece_ip == "0") {
            //network
            //verificar se o ip já existe na lista de networks
            if(nets.length != 0){
                for(var j=0;j<nets.length;j++){
                    if(ip == nets[j].getPrefix() && netmask == nets[j].getNetmask()) continue loop1;
                }
            }
            nets.push(new Network("Network "+network_count,ip,netmask));
            network_count++;            
            continue;
        }        
    }
    console.log(nets)
    return(nets);
}

function objectifyHosts(ips){
    var hts = [];
    loop1: for(var i=0; i<ips.length;i++){
        if(ips[i].includes("{")) continue;
        ip = ips[i].split("/")[0];
        netmask = ips[i].split("/")[1];
        last_piece_ip = ip.split(".");
        last_piece_ip = last_piece_ip[last_piece_ip.length-1];
        if(last_piece_ip != "0") {   
            //host
            //verificar se o host já existe na lista de hosts
            if(hts.length != 0){
                for(var j=0;j<hts.length;j++){
                    if(ip == hts[j].getIP()) continue loop1;
                }
            }
            hts.push(new Host("Host "+host_count,ip,netmask));
            host_count++; 
        }
    }
    
    return(hts);
}

function objectifyHostsList(ips){
    var htl = [];
    var hts= [];
    loop1: for(var i=0; i<ips.length;i++){
        hts = []
        if(!ips[i].includes("{")) continue;
        naked_ips = ips[i].substring(1,ips[i].length-1);
        if(!naked_ips.includes(",")) { //apenas um ip dentro das chaves, cria o host
            for(var j=0;j<hosts.length;j++){
                if(naked_ips == hosts[j].getIP()) continue loop1;
            }
            ip = naked_ips.split("/")[0];
            netmask = naked_ips.split("/")[1];
            hosts.push(new Host("Host "+host_count,ip,netmask));
            host_count++; 
            continue loop1;
        }
        //tem uma virgula ou seja, tem mais de um ip na lista
        naked_ips = naked_ips.split(",");
        loop2: for(var j=0;j<naked_ips.length;j++){
            for(var k=0;k<hosts.length;k++){
                if(naked_ips[j] == hosts[k].getIP()) continue loop2;
            }
            //cria o host 
            ip = naked_ips[j].split("/")[0];
            netmask = naked_ips[j].split("/")[1];
            hosts.push(new Host("Host "+host_count,ip,netmask));
            host_count++; 
            //procura o host e adicionar num array de Hosts
            ht = findHost(ip);
            hts.push(ht);
        }
        htl.push(new Hosts("Hosts "+hosts_count,hts));
        hosts_count++;
    }
    return htl;
}


function objectifyIncomingTraffics(lines){
    traffics = [];
    for(var i=0;i<lines.length;i++){
        if(lines[i].includes("all")) continue;
        if(lines[i].includes("pass out")) continue;
        if(lines[i].includes("block")) continue;
        af = getAFIncomingTrafficPF(lines[i]);
        inter = getInterfaceIncomingTrafficPF(lines[i]);
        ext_ent = getExternEntityIncomingTrafficPF(lines[i]);
        src_port = getSourcePortTrafficPF(lines[i]);
        rdr_port = getRedirectPortIncomingTrafficPF(lines[i]);
        proto = getProtocolTrafficPF(lines[i]);
        traffics.push(new IncomingTraffic(traffic_in_ids, "Incoming Traffic "+incoming_traffic_count, af, inter, ext_ent, src_port, rdr_port, proto))
        traffic_in_ids++;
        incoming_traffic_count++;
    }
    console.log(traffics);
    return traffics;
}

// constructor(id, name, af, inter, extern_entity, source_port, redirect_port, protocols)

function getAFIncomingTrafficPF(line){
    af = line.split(" ");
    af = af[4].toLowerCase();
    return af;
}

function getInterfaceIncomingTrafficPF(line){
    int = line.split(" ");
    int = int[3].toLowerCase();
    int = findInterface(int);
    return int;
}

function getExternEntityIncomingTrafficPF(line){
    ip="";
    fromip = getFromIP(line);
    if(fromip == "any") {
        return unknown_networks;
    }

    if(!fromip.includes("{")) {
        entity = findEntity(fromip)
        return entity;
    }
    
    naked_ip = fromip.substring(1,fromip.length-1);
    if(!naked_ip.includes(",")) { //apenas um ip dentro das chaves
        entity = findEntity(naked_ip)
        return entity;
    }
    //tem uma virgula ou seja, tem mais de um ip na lista
    entity = findHostList(naked_ip);
    return entity;

}

function getSourcePortTrafficPF(line){
    port = line.split("from")[1];
    port = port.split(" to ")[0];
    if(!port.includes("port")) return "*";
    port = port.split("port")[1];
    port = port.replace(/\s/g, '');
    return port;
}

function getRedirectPortIncomingTrafficPF(line){
    if(!line.includes("rdr")) return "";
    port = line.split("rdr")[1];
    port = port.split("port")[1];
    port = port.replace(/\s/g, '');
    return port;
}

function getProtocolTrafficPF(line){
    proto = line.split("proto")[1];
    proto = proto.split("from")[0];
    if(!proto.includes("{")) return proto.replace(/\s/g, '');
    proto = proto.replace(/\s/g, '');
    proto = proto.substring(1,proto.length-1);
    return proto;
}

function findHost(ip){
    for(var i=0;i<hosts.length;i++){
        if(hosts[i].getIP() == ip) return hosts[i];
    }
    return false;
}

function findInterface(name){
    for(var i=0;i<interfaces.length;i++){
        if(interfaces[i].getDeviceName() == name)  return interfaces[i];
    }
    return false;
}

function findEntity(ip){
    ip_portion = ip.split("/")[0];
    netmask = ip.split("/")[1]
    for(var i=0;i<hosts.length;i++){
        if(hosts[i].getIP() == ip_portion) return hosts[i];
    }
    for(var i=0;i<networks.length;i++){
        if(networks[i].getPrefix() == ip_portion && networks[i].getNetmask() == netmask) return networks[i];
    }
    return false;
}

function findHostList(ips){
    ips = ips.split(",");
    for(var i=0;i<ips.length;i++){
        ips[i] = ips[i].split("/")[0];
    }
    achei = 0;
    loop1: for(var i=0;i<hosts_list.length;i++){
        hts = hosts_list[i].getHosts();
        achei=0;
        loop2: for(var j=0;j<hts.length;j++){
            loop3: for(var k=0;k<ips.length;k++){
                if(hts[j].getIP() == ips[k]) {
                    achei++;
                    continue loop2;
                }
            }
            if(achei==0) continue loop1;
        }
        if(achei == ips.length) return hosts_list[i];
    }
}