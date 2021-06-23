function ObjectifyPacketFilter(rules){
    redefineStructureObjects();
    redefineCounters();
    redefineTrafficIDSCounters();

    firewall = objectifyFirewall(rules);
    if(firewall == null){
        alert("There is no default policy defined for firewall");
        return null;
    }     
    //console.log(firewall);

    interfaces = objectifyInterfaces(rules);
    if(interfaces == null){
        alert("There are no interfaces defined for firewall");
        return null;
    }     
    //console.log(interfaces);

    unknown_networks = objectifyUnknownNetwork(rules);
    //console.log(unknown_networks)

    objectifyEntities(rules);

    incoming_traffics = objectifyIncomingTraffics(rules);
    outgoing_traffics = objectifyOutgoingTraffics(rules);
    block_traffics = objectifyBlockTraffics(rules);

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
        if(!lines[i].includes(" rdr")){
            toip = getToIP(lines[i]);
            if(toip != "any") ips.push(toip);
        }   
        rdrip = getRdrIP(lines[i]);
        if(rdrip != null) ips.push(rdrip);
    }
    networks = objectifyNetworks(ips);
    hosts = objectifyHosts(ips);
    hosts_list = objectifyHostsList(ips)

    //console.log(networks);
    //console.log(hosts);
    //console.log(hosts_list);
}

function objectifyNetworks(ips){
    var nets=[];
    loop1: for(var i=0; i<ips.length;i++){
        ip = ips[i].replace(/\s/g, '');
        if(ips[i].includes("{")) {            
            ip = ip.substring(1,ip.length-1);
            if(ip.includes(",")) continue;
        }        
        ip_portion = ip.split("/")[0];
        netmask = ip.split("/")[1];
        if(isNetwork(ip.split("/")[0])) {
            //network
            //verificar se o ip já existe na lista de networks
            if(nets.length != 0){
                for(var j=0;j<nets.length;j++){
                    if(ip_portion == nets[j].getPrefix() && netmask == nets[j].getNetmask()) continue loop1;
                }
            }
            nets.push(new Network("Network "+network_count,ip_portion,netmask));
            network_count++;            
            continue;
        }        
    }
    //console.log(nets)
    return(nets);
}

function objectifyHosts(ips){
    var hts = [];
    loop1: for(var i=0; i<ips.length;i++){
        if(ips[i].includes("{")) continue;
        ip = ips[i].split("/")[0];
        var netmask = 24;
        if(typeof ips[i].split("/")[1] !== "undefined") netmask = ips[i].split("/")[1];
        if(!isNetwork(ip)) {   
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
        hts = [];
        if(!ips[i].includes("{")) continue;
        naked_ips = ips[i].substring(1,ips[i].length-1);
        if(!naked_ips.includes(",")) { //apenas um ip dentro das chaves, cria o host se não existir, sem host list
            ip = naked_ips.split("/")[0];
            if(findHost(ip) != false || isNetwork(ip)) continue loop1; //já existe o host ou é uma network
            var netmask = 24;
            if(typeof ips[i].split("/")[1] !== "undefined") netmask = ips[i].split("/")[1];
            hosts.push(new Host("Host "+host_count,ip,netmask));
            host_count++; 
            continue loop1;
        }
        //tem uma virgula ou seja, tem mais de um ip na lista
        naked_ips = naked_ips.split(",");
        loop2: for(var j=0;j<naked_ips.length;j++){
            var exists = 0;
            for(var k=0;k<hosts.length;k++){
                if(naked_ips[j].split("/")[0] == hosts[k].getIP()) exists = 1;
            }            
            ip = naked_ips[j].split("/")[0];
            var netmask = 24;
            if(typeof naked_ips[j].split("/")[1] !== "undefined") netmask = naked_ips[j].split("/")[1];
            if(exists == 0){ //cria o host 
                hosts.push(new Host("Host "+host_count,ip,netmask));
                host_count++; 
            }            
            //procura o host e adicionar num array de Hosts
            
            ht = findHost(ip);
            hts.push(ht);
        }
        htl_temp = new Hosts("Hosts "+hosts_count,hts);
        if(doesHostListExist(htl_temp,htl)) continue loop1;
        htl.push(htl_temp);
        hosts_count++;
    }
    //console.log(htl);
    return htl;
}


function objectifyIncomingTraffics(lines){
    traffics = [];
    for(var i=0;i<lines.length;i++){
        if(lines[i].includes("all")) continue;
        if(lines[i].includes("pass out")) continue;
        if(lines[i].includes("block")) continue;
        af = getAFIncomingTrafficPF(lines[i]);
        inter = getInterfaceTrafficPF(lines[i]);
        ext_ent = getExternEntityIncomingTrafficPF(lines[i]);
        src_port = getSourcePortTrafficPF(lines[i]);
        rdr_port = getRedirectPortIncomingTrafficPF(lines[i]);
        proto = getProtocolTrafficPF(lines[i]);
        tfc = new IncomingTraffic(traffic_in_ids, "Incoming Traffic "+incoming_traffic_count, af, inter, ext_ent, src_port, rdr_port, proto);
        if(!IncomingTrafficExists(tfc, traffics)){
            traffics.push(tfc);
            traffic_in_ids++;
            incoming_traffic_count++;
        }        
    }
    //console.log(traffics);
    return traffics;
}

function objectifyOutgoingTraffics(lines){
    traffics = [];
    out_lines =[];
    in_lines = [];
    consumed = [];
    count_outgoing = 0;
    count_incoming = 0;
    var proto = "";
    var int_txt = "";
    var ip = "";
    var port = "";
    var proto2 = "";
    var int_txt2 = "";
    var ip2 = "";
    var port2 = "";
    for(var i=0;i<lines.length;i++){
        if(!lines[i].includes("all") && !lines[i].includes("pass in") && !lines[i].includes("block")) {
            out_lines.push(lines[i]);
        }
    }
    for(var i=0;i<lines.length;i++){
        if(!lines[i].includes("all") && !lines[i].includes("pass out") && !lines[i].includes("block")) {
            in_lines.push(lines[i]);
        }
    }
    for(var i=0;i<out_lines.length;i++){
        if(consumed.includes(out_lines[i])) continue;
        int_txt = out_lines[i].split(" ")[3].toLowerCase();
        proto = getProtocolTrafficPF(out_lines[i]);
        ip = getToIP(out_lines[i]);
        port = getDestinyPortTrafficPF(out_lines[i]);
        //console.log(out_lines[i]);
        /*if(port == "80" || port =="443"){
            console.log(out_lines[i]);

            console.log("int_txt "+int_txt);
            console.log("ip "+ip);
            console.log("proto "+proto);
            console.log("port "+port);
        }*/
        count_outgoing = 0;
        for(var j=0;j<out_lines.length;j++){
            if(consumed.includes(out_lines[j])) continue;
            int_txt2 = out_lines[j].split(" ")[3].toLowerCase();
            proto2 = getProtocolTrafficPF(out_lines[j]);
            ip2 = getToIP(out_lines[j]);
            port2 = getDestinyPortTrafficPF(out_lines[j]);
            if((int_txt === int_txt2) && (proto === proto2) && (ip === ip2) && (port === port2)){
                count_outgoing++;
                consumed.push(out_lines[j]);
            }                                
        }
        //console.log(consumed);
        count_incoming = count_outgoing;
        in_traffics =[];
        for(var j=0;j<in_lines.length;j++){
            if(count_incoming>0){
                proto_in = getProtocolTrafficPF(in_lines[j]);
                if(getRedirectPortIncomingTrafficPF(in_lines[j]) != ""){
                    ip_in = getRdrIP(in_lines[j]);                
                    port_in = in_lines[j].split(" ");
                    port_in = port_in[port_in.length-1];    
                }                    
                else {
                    ip_in = getToIP(in_lines[j]);    
                    port_in = getDestinyPortTrafficPF(in_lines[j]);
                }                             
                //console.log("ip_in "+ip_in);
                //console.log("proto_in "+proto_in);
                //console.log("port_in "+port_in);
                if(proto_in == proto && ip_in == ip && port_in == port){
                    in_traffics.push(findIncomingTraffic(in_lines[j]));
                    count_incoming--;
                }
            }
        }
        //console.log(in_traffics);
        inter = getInterfaceTrafficPF(out_lines[i]);
        ext_ent = getExternEntityOutgoingTrafficPF(out_lines[i]);
        dst_port = getDestinyPortTrafficPF(out_lines[i]);
        nat = "";
        if(out_lines[i].includes(" nat")) nat = "nat";
        traffics.push(new OutgoingTraffic("Outgoing Traffic "+outgoing_traffic_count, inter, ext_ent, dst_port, nat, in_traffics));
        outgoing_traffic_count++;
    }
    //console.log(traffics);
    return(traffics);
}

function objectifyBlockTraffics(lines){
    traffics = [];
    for(var i=0;i<lines.length;i++){
        if(lines[i].includes("all")) continue;
        if(lines[i].includes("pass ")) continue;
        af = getAFIncomingTrafficPF(lines[i]);
        inter = getInterfaceTrafficPF(lines[i]);
        ext_ent = getExternEntityIncomingTrafficPF(lines[i]);
        src_port = getSourcePortTrafficPF(lines[i]);
        ext_ent_dst = getExternEntityOutgoingTrafficPF(lines[i]);
        dst_port = getDestinyPortTrafficPF(lines[i]);
        proto = getProtocolTrafficPF(lines[i]);
        traffics.push(new BlockTraffic(traffic_blk_ids, "Block Traffic "+block_traffic_count, af, inter, ext_ent, src_port, ext_ent_dst, dst_port, proto))
        traffic_blk_ids++;
        block_traffic_count++;
    }
    //console.log(traffics);
    return traffics;
}

function getAFIncomingTrafficPF(line){
    af = line.split(" ");
    af = af[4].toLowerCase();
    return af;
}

function getInterfaceTrafficPF(line){
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
        entity = findEntityPF(fromip)
        return entity;
    }    
    naked_ip = fromip.substring(1,fromip.length-1);
    if(!naked_ip.includes(",")) { //apenas um ip dentro das chaves
        entity = findEntityPF(naked_ip)
        return entity;
    }
    //tem uma virgula ou seja, tem mais de um ip na lista
    entity = findHostList(naked_ip);
    return entity;
}

function getExternEntityOutgoingTrafficPF(line){
    ip="";
    toip = getToIP(line);
    if(toip == "any") {
        return unknown_networks;
    }
    if(!toip.includes("{")) {
        entity = findEntityPF(toip)
        return entity;
    }    
    naked_ip = toip.substring(1,toip.length-1);
    if(!naked_ip.includes(",")) { //apenas um ip dentro das chaves
        entity = findEntityPF(naked_ip)
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

function getDestinyPortTrafficPF(line){
    port = line.split(" to ")[1];
    if(!port.includes("port")) return "*";
    port = port.split("port")[1];
    port = port.split(" ")[1]
    return port;
}

function getRedirectPortIncomingTrafficPF(line){
    if(!line.includes("rdr")) return "";
    port = line.split("rdr")[0];
    port = port.split(" ");    
    port = port[port.length-2]
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

function findHost(ip){
    for(var i=0;i<hosts.length;i++){
        if(hosts[i].getIP() == ip) return hosts[i];
    }
    return false;
}

function isNetwork(ip){
    last_piece_ip = ip.split(".");
    last_piece_ip = last_piece_ip[last_piece_ip.length-1];
    if(last_piece_ip == "0") return true;
    return false;
}

function findInterface(name){
    for(var i=0;i<interfaces.length;i++){
        if(interfaces[i].getDeviceName() == name)  return interfaces[i];
    }
    return false;
}

function findEntityPF(ip){
    ip_portion = ip.split("/")[0];
    var netmask = 24;
    if(typeof ip.split("/")[1] !== "undefined") netmask = ip.split("/")[1];
    for(var i=0;i<hosts.length;i++){
        if(hosts[i].getIP() == ip_portion) return hosts[i];
    }
    for(var i=0;i<networks.length;i++){
        if(networks[i].getPrefix() == ip_portion && networks[i].getNetmask() == netmask) return networks[i];
    }
    return false;
}

function doesHostListExist(hts,htl){
    for(var i=0;i<htl.length;i++){
        if(JSON.stringify(htl[i].getHosts()) == JSON.stringify(hts.getHosts())) return true;
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

function findIncomingTraffic(traffic){   
    af = getAFIncomingTrafficPF(traffic);
    inter = getInterfaceTrafficPF(traffic);
    ext_ent = getExternEntityIncomingTrafficPF(traffic);
    src_port = getSourcePortTrafficPF(traffic);
    rdr_port = getRedirectPortIncomingTrafficPF(traffic);
    proto = getProtocolTrafficPF(traffic);    

    for(var i = 0; i < incoming_traffics.length; i++){
        if(incoming_traffics[i].getAf() == af && 
           incoming_traffics[i].getInterface().getDeviceName() == inter.getDeviceName() && 
           incoming_traffics[i].getExternEntity() == ext_ent &&
           incoming_traffics[i].getSourcePort() == src_port &&
           incoming_traffics[i].getRedirectPort() == rdr_port &&
           incoming_traffics[i].getProtocols() == proto){

                return incoming_traffics[i];
        }
    }
}

function IncomingTrafficExists(traffic, traffics){    
    if(traffics.length == 0) return false;
    for(var i = 0; i < traffics.length; i++){
        if(traffics[i].getAf() == traffic.getAf() && 
            traffics[i].getInterface() == traffic.getInterface() &&
            traffics[i].getExternEntity() == traffic.getExternEntity() &&
            traffics[i].getSourcePort() == traffic.getSourcePort() &&
            traffics[i].getRedirectPort() == traffic.getRedirectPort() &&
            traffics[i].getProtocols() == traffic.getProtocols())

                return true;
    }
    return false;
}