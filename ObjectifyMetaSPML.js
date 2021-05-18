

function objectifyMetaSPML(spml){
    lines = spml.split("\n")
    firewall = createFirewall(lines);
    interfaces = createInterfaces(lines);
    hosts = createHosts(lines);
    unknown_networks = creatUnknownNetworks(lines);
    networks = createNetworks(lines);
    hosts_list = createHostsList(lines);
    incoming_traffics = createIncomingTraffics(lines);
    outgoing_traffics = createOutgoingTraffics(lines);
    block_traffics = createBlockTraffics(lines);
}

function createFirewall(lines){
    firewall_line = "";
    for(i=0;i<lines.length;i++){
        if(lines[i].startsWith("fw(")) {
            firewall_line = lines[i];
            break;
        }
    }
    if(firewall_line == "") return null;
    firewall_line = firewall_line.substr(3);
    firewall_line = firewall_line.substr(0, firewall_line.indexOf(")"));
    firewall_attrs = firewall_line.split(",");
    firewall = new Firewall(firewall_attrs[0],firewall_attrs[1]);
    return firewall;
}

function createInterfaces(lines){
    interfaces_lines = simplifyLines(lines,"if(");
    interfaces_array = [];
    for(i=0;i<interfaces_lines.length;i++){
        interface_attr = interfaces_lines[i].split(",");
        interfaces_array.push(new Interface(interface_attr[0],interface_attr[1],interface_attr[2],interface_attr[3],interface_attr[4]));
    }
    return interfaces_array;
}

function createHosts(lines){
    hosts_lines = simplifyLines(lines,"ht(");
    if(hosts_lines == null) return;
    hosts_array = [];
    for(i=0;i<hosts_lines.length;i++){
        host_attr = hosts_lines[i].split(",");
        hosts_array.push(new Host(host_attr[0],host_attr[1],host_attr[2]));
    }
    return hosts_array;
}

function creatUnknownNetworks(lines){
    unknown_networks_lines = simplifyLines(lines,"un(");
    if(unknown_networks_lines == null) return;
    unknown_networks_array = [];
    for(i=0;i<unknown_networks_lines.length;i++){
        unknown_network_attr = unknown_networks_lines[i].split(",");
        unknown_networks_array.push(new UnknownNetwork(unknown_network_attr[0]));
    }
    return unknown_networks_array;
}

function createNetworks(lines){
    networks_lines = simplifyLines(lines,"net(");
    if(networks_lines == null) return;
    networks_array = [];
    for(i=0;i<networks_lines.length;i++){
        network_attr = networks_lines[i].split(",");
        networks_array.push(new Network(network_attr[0],network_attr[1],network_attr[2]));
    }
    return networks_array;
}

function createHostsList(lines){
    hosts_list_lines = simplifyLines(lines,"htl(");
    if(hosts_list_lines == null) return;
    hosts_list_array = [];
    for(i=0;i<hosts_list_lines.length;i++){
        hosts_list_attr = hosts_list_lines[i].split(",");
        name = hosts_list_attr[0];
        hosts_list_attr.shift(); //remove o primeiro elemento, o nome
        hosts_inside = [];
        for(i=0;i<hosts_list_attr.length;i++){
            for(j=0;j<hosts.length;j++){
                if(hosts_list_attr[i] == hosts[j].getName()){
                    hosts_inside.push(hosts[j]);
                    break;
                }
            }
            
        }
        hosts_list_array.push(new Hosts(name,hosts_inside));
    }
    return hosts_list_array;
}

function createIncomingTraffics(lines){
    incoming_lines = simplifyLines(lines,"it(");
    if(incoming_lines == null) return
    incoming_traffics_array=[];
    for(var i=0;i<incoming_lines.length;i++){
        incoming_attrs = incoming_lines[i].split(",");
        id = incoming_attrs[0];
        name = incoming_attrs[1];
        af = incoming_attrs[2];
        var inter;
        for(var j=0;j<interfaces.length;j++){
            if(interfaces[j].getName() == incoming_attrs[3]){
                inter = interfaces[j];
                break;
            }                
        }
        srcname = findEntity(incoming_attrs[4]);
        srcport = incoming_attrs[5];
        rdrport = incoming_attrs[6];
        protocols = incoming_attrs.slice(7,incoming_attrs.length);
        incoming_traffics_array.push(new IncomingTraffic(id,name,af,inter,srcname,srcport,rdrport,protocols));
    }
    return incoming_traffics_array;
}

function createOutgoingTraffics(lines){
    outgoing_lines = simplifyLines(lines,"ot(");
    if(outgoing_lines == null) return
    outgoing_traffics_array=[];
    for(var i=0;i<outgoing_lines.length;i++){
        outgoing_attrs = outgoing_lines[i].split(",");
        var name = outgoing_attrs[0];
        var inter;
        for(var j=0;j<interfaces.length;j++){
            if(interfaces[j].getName() == outgoing_attrs[1]){
                inter = interfaces[j];
                break;
            }                
        }
        var dstname = findEntity(outgoing_attrs[2]);
        dstport = outgoing_attrs[3];
        nat = outgoing_attrs[4];
        incoming_ids = outgoing_attrs.slice(5,outgoing_attrs.length);
        incoming_traffics_array = [];
        loop1:
            for(var j=0;j<incoming_ids.length;j++){
                loop2:
                    for(var k=0;k<this.incoming_traffics.length;k++){
                        if(incoming_ids[j] == this.incoming_traffics[k].getId()){
                            incoming_traffics_array.push(this.incoming_traffics[k]);
                            continue loop1;
                        }
                    }
            }
        outgoing_traffics_array.push(new OutgoingTraffic(name,inter,dstname,dstport,nat,incoming_traffics_array));
    }
    return outgoing_traffics_array;
}

function createBlockTraffics(lines){
    block_lines = simplifyLines(lines,"blk(");
    if(block_lines == null) return
    block_traffics_array=[];
    for(var i=0;i<block_lines.length;i++){
        block_attrs = block_lines[i].split(",");
        id = block_attrs[0];
        name = block_attrs[1];
        af = block_attrs[2];
        var inter;
        for(var j=0;j<interfaces.length;j++){
            if(interfaces[j].getName() == block_attrs[3]){
                inter = interfaces[j];
                break;
            }                
        }
        srcname =  findEntity(block_attrs[4]);
        srcport = block_attrs[5];
        dstextent = findEntity(block_attrs[6]);
        dstport = block_attrs[7];
        protocols = block_attrs.slice(8,block_attrs.length);
        block_traffics_array.push(new BlockTraffic(id,name,af,inter,srcname,srcport,dstextent,dstport,protocols));
    }
    return block_traffics_array;
}

function simplifyLines(lines,prefix){
    array = []
    for(var i=0;i<lines.length;i++){
        if(lines[i].startsWith(prefix)) {
            array.push(lines[i]);
        }
    }
    if(array == "") return null;
    for(var i=0;i<array.length;i++){
        if(typeof array[i] !== "undefined"){
            array[i] = array[i].substr(prefix.length);
            array[i] = array[i].substr(0, array[i].indexOf(")"));
        }
    }    
    return array;
}

function findEntity(name){
    if(hosts){
        for(i=0;i<hosts.length;i++){
            if(hosts[i].getName() == name)
            return hosts[i];
        }
    }
    if(hosts_list){
        for(i=0;i<hosts_list.length;i++){
            if(hosts_list[i].getName() == name)
            return hosts_list[i];
        }
    }    
    if(networks){
        for(i=0;i<networks.length;i++){
            if(networks[i].getName() == name)
            return networks[i];
        }
    }
    if(unknown_networks){
        for(i=0;i<unknown_networks.length;i++){
            if(unknown_networks[i].getName() == name)
            return unknown_networks[i];
        }
    }
}