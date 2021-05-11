function validateDeviceName(inputText){
    interfaces = myDiagram.findNodesByExample({category: "Interface"});
    interfaces_array = [];
    it = interfaces.iterator;
    while(it.next()){
        //MUDAR ESSE "TEXT" PRA NOME FUTURAMENTE
        if(it.value.data["Device Name"]==="") continue;
        interfaces_array.push(it.value.data["Device Name"]);
    }
    if(interfaces_array.filter(item => item == inputText).length > 1) {
        return false;
    }
    return true;
}

function validateIPaddress(inputText){
    var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if(!inputText.match(ipformat)) return false;
    return true;
}

function validatePort(inputText){
    if(inputText === "*") return true;
    intText = parseInt(inputText);
    if(intText<0 || intText > 65535 || isNaN(intText)) return false;
    return true;
}

function validateNetmask(inputText){
    intText = parseInt(inputText);
    if(intText<1 || intText>32) return false;
    return true;
}

function validateAllFields(){
    validateFirewall();
    validateInterfaces();
    validateHosts();
    validateNetworks();
    validateHostsList();
    validateInternets();
    validateIncomingTraffics();
    validateOutgoingTraffic();
    validateBlockTraffic();
    validateRedirectTraffics();
    validateNATTraffic();
}

function validateFirewall(){
    firewall = myDiagram.findNodesByExample({category: "Firewall"});
    firewall = firewall.iterator;
    firewall = firewall.first();
    if(firewall.data.text === "") alert("Firewall must have a valid name");
}

function validateInterfaces(){
    interfaces = myDiagram.findNodesByExample({category: "Interface"});
    it = interfaces.iterator;
    while(it.next()){
        if(it.value.data.text == "") alert("Interface must have a valid name");
        if(it.value.data["Device Name"] == "") alert("Interface must have a valid Device Name");
        if(it.value.data["IP"] == "") alert("Interface must have a valid IP");
        if(it.value.data["Netmask"] == "") alert("Interface must have a valid Netmask");
    }
}

function validateHosts(){
    hosts = myDiagram.findNodesByExample({category: "Host"});
    if(hosts.count == 0) return;
    it = hosts.iterator;
    while(it.next()){
        if(it.value.data.text == "") alert("Host must have a valid name");
        if(it.value.data["IP"] == "") alert("Host must have a valid IP");
        if(it.value.data["Netmask"] == "") alert("Host must have a valid Netmask");
    }
}

function validateNetworks(){
    network = myDiagram.findNodesByExample({category: "Network"});
    if(network.count == 0) return;
    it = network.iterator;
    while(it.next()){
        if(it.value.data.text == "") alert("Network must have a valid name");
        if(it.value.data["Prefix"] == "") alert("Network must have a valid Prefix");
        if(it.value.data["Netmask"] == "") alert("Network must have a valid Netmask");
    }
}

function validateHostsList(){
    hosts_list = myDiagram.findNodesByExample({category: "Hosts"});
    if(hosts_list.count == 0) return;
    it = hosts_list.iterator;
    while(it.next()){
        if(it.value.data.text == "") alert("Host must have a valid name");
        if(it.value.data["Hosts"] == "") alert("Host List must have at least one host");
    }
}

function validateInternets(){
    internets = myDiagram.findNodesByExample({category: "Internet"});
    if(internets.count == 0) return;
    it = internets.iterator;
    while(it.next()){
        if(it.value.data.text == "") alert("Internet must have a valid name");
    }
}

function validateIncomingTraffics(){
    incoming_traffics = myDiagram.findLinksByExample({category: "TrafegoEntrada"});
    if(incoming_traffics.count == 0) return;
    it = incoming_traffics.iterator;
    while(it.next()){
        if(it.value.data.text == "") alert("Incoming Traffic must have a valid name");
        if(it.value.data["Source Port"] == "") alert("Incoming Traffic must have a valid Source Port");
        if(it.value.data["Protocols"] == "") alert("Incoming Traffic must have at least one protocol");
    }
}

function validateOutgoingTraffic(){
    outgoing_traffics = myDiagram.findLinksByExample({category: "TrafegoSaida"});
    if(outgoing_traffics.count == 0) return;
    it = outgoing_traffics.iterator;
    while(it.next()){
        if(it.value.data.text == "") alert("Outgoing Traffic must have a valid name");
        if(it.value.data["Destiny Port"] == "") alert("Outgoing Traffic must have a valid Destiny Port");
        if(it.value.data["Traffic IDs"] == "") alert("Outgoing Traffic must have at least one Incoming Traffic");
    }
}

function validateBlockTraffic(){
    block_traffics = myDiagram.findLinksByExample({category: "TrafegoBloqueio"});
    if(block_traffics.count == 0) return;
    it = block_traffics.iterator;
    while(it.next()){
        if(it.value.data.text == "") alert("Block Traffic must have a valid name");
        if(it.value.data["Destiny Entities"] == "") alert("Block Traffic must have at least one Destiny Entity");
        if(it.value.data["Source Port"] == "") alert("Block Traffic must have a valid Source Port");
        if(it.value.data["Destiny Port"] == "") alert("Block Traffic must have a valid Destiny Port");
        if(it.value.data["Protocols"] == "") alert("Block Traffic must have at least one protocol");
    }
}

function validateRedirectTraffics(){
    redirect_traffics = myDiagram.findLinksByExample({category: "TrafegoRedirecionamento"});
    if(redirect_traffics.count == 0) return;
    it = redirect_traffics.iterator;
    while(it.next()){
        if(it.value.data.text == "") alert("Redirect Traffic must have a valid name");
        if(it.value.data["Source Port"] == "") alert("Redirect Traffic must have a valid Source Port");
        if(it.value.data["Redirect Port"] == "") alert("Redirect Traffic must have a valid Redirect Port");
        if(it.value.data["Protocols"] == "") alert("Redirect Traffic must have at least one protocol");
    }
}

function validateNATTraffic(){
    outgoing_traffics = myDiagram.findLinksByExample({category: "TrafegoTraducao"});
    if(outgoing_traffics.count == 0) return;
    it = outgoing_traffics.iterator;
    while(it.next()){
        if(it.value.data.text == "") alert("NAT Traffic must have a valid name");
        if(it.value.data["Destiny Port"] == "") alert("NAT Traffic must have a valid Destiny Port");
        if(it.value.data["Traffic IDs"] == "") alert("NAT Traffic must have at least one Incoming Traffic");
    }
}

function validateUniqueName(node, value){
    category = node.category;
    if(isNaN(value)==false) {
        alert("Name can't be a number");
        return false;
    }
    if(value.includes(",")){
        alert("Name can't contain a comma \",\"");
        return false;
    }
    switch (category) {
        case 'Interface':
            interfaces = myDiagram.findNodesByExample({category: "Interface"});
            it = interfaces.iterator;
            count=0;
            while(it.next()){
                if(it.value.data.text == value) count++;
            }
            if(count>1) {
                alert("Interface name must be unique");
                return false;
            }
            return true;
            break;
        case 'Host':
            hosts = myDiagram.findNodesByExample({category: "Host"});
            it = hosts.iterator;
            count=0;
            while(it.next()){
                if(it.value.data.text == value) count++;
            }
            if(count>1) {
                alert("Host name must be unique");
                return false;
            }
            return true;
            break;
        case 'Network':
            networks = myDiagram.findNodesByExample({category: "Network"});
            it = networks.iterator;
            count=0;
            while(it.next()){
                if(it.value.data.text == value) count++;
            }
            if(count>1) {
                alert("Network name must be unique");
                return false;
            }
            return true;
            break;
        case 'Hosts':
            hostslist = myDiagram.findNodesByExample({category: "Hosts"});
            it = hostslist.iterator;
            count=0;
            while(it.next()){
                if(it.value.data.text == value) count++;
            }
            if(count>1) {
                alert("Host List name must be unique");
                return false;
            }
            return true;
            break;
        case 'Internet':
            internets = myDiagram.findNodesByExample({category: "Internet"});
            it = internets.iterator;
            count=0;
            while(it.next()){
                if(it.value.data.text == value) count++;
            }
            if(count>1) {
                alert("Internet name must be unique");
                return false;
            }
            return true;
            break;
        default: return true;
    }
}
