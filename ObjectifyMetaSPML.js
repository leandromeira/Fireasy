function objectifyMetaSPML(spml){
    lines = spml.split("\n")
    var firewall = createFirewall(lines);
    //console.log(firewall);
    var interfaces = createInterfaces(lines);
    var hosts = createHosts(lines);
    var unknown_networks = creatUnknownNetworks(lines);
    var networks = createNetworks(lines);

}

function simplifyLine(line){
    line = line.substr(3);
    line = line.substr(0, line.indexOf(")"));
    return line;
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
    firewall_line = simplifyLine(firewall_line);
    firewall_attrs = firewall_line.split(",");
    firewall = new Firewall(firewall_attrs[0],firewall_attrs[1]);
    return firewall;
}

function createInterfaces(lines){
    interfaces_lines = [];
    for(i=0;i<lines.length;i++){
        if(lines[i].startsWith("if(")) {
            interfaces_lines.push(lines[i]);
        }
    }
    if(interfaces_lines == "") return null;
    for(i=0;i<interfaces_lines.length;i++){
        if(typeof interfaces_lines[i] !== "undefined") interfaces_lines[i] = simplifyLine(interfaces_lines[i]);
    }
    interfaces = [];
    for(i=0;i<interfaces_lines.length;i++){
        interface_attr = interfaces_lines[i].split(",");
        interfaces.push(new Interface(interface_attr[0],interface_attr[1],interface_attr[2],interface_attr[3],interface_attr[4]));
    }
    return interfaces;
}

function createHosts(lines){
    hosts_lines = [];
    for(i=0;i<lines.length;i++){
        if(lines[i].startsWith("ht(")) {
            hosts_lines.push(lines[i]);
        }
    }
    if(hosts_lines == "") return null;
    for(i=0;i<hosts_lines.length;i++){
        if(typeof hosts_lines[i] !== "undefined") hosts_lines[i] = simplifyLine(hosts_lines[i]);
    }
    hosts = [];
    for(i=0;i<hosts_lines.length;i++){
        host_attr = hosts_lines[i].split(",");
        hosts.push(new Host(host_attr[0],host_attr[1],host_attr[2]));
    }
    return hosts;
}

function creatUnknownNetworks(lines){
    unknown_networks_lines = [];
    for(i=0;i<lines.length;i++){
        if(lines[i].startsWith("un(")) {
            unknown_networks_lines.push(lines[i]);
        }
    }
    if(unknown_networks_lines == "") return null;
    for(i=0;i<unknown_networks_lines.length;i++){
        if(typeof unknown_networks_lines[i] !== "undefined") unknown_networks_lines[i] = simplifyLine(unknown_networks_lines[i]);
    }
    unknown_networks = [];
    for(i=0;i<unknown_networks_lines.length;i++){
        unknown_network_attr = unknown_networks_lines[i].split(",");
        unknown_networks.push(new UnknownNetwork(unknown_network_attr[0]));
    }
    return unknown_networks;
}

function createNetworks(lines){
    networks_lines = [];
    for(i=0;i<lines.length;i++){
        if(lines[i].startsWith("net(")) {
            networks_lines.push(lines[i]);
        }
    }
    if(networks_lines == "") return null;
    for(i=0;i<networks_lines.length;i++){
        if(typeof networks_lines[i] !== "undefined") networks_lines[i] = simplifyLine(networks_lines[i]);
    }
    networks = [];
    for(i=0;i<networks_lines.length;i++){
        network_attr = networks_lines[i].split(",");
        networks.push(new Network(network_attr[0],network_attr[1],network_attr[2]));
    }
    return networks;
}
