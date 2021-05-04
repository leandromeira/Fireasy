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
    if(hosts === null) return;
    it = hosts.iterator;
    while(it.next()){
        if(it.value.data.text == "") alert("Host must have a valid name");
        if(it.value.data["IP"] == "") alert("Host must have a valid IP");
        if(it.value.data["Netmask"] == "") alert("Host must have a valid Netmask");
    }
}

function validateNetworks(){
    network = myDiagram.findNodesByExample({category: "Network"});
    if(network === null) return;
    it = network.iterator;
    while(it.next()){
        if(it.value.data.text == "") alert("Network must have a valid name");
        if(it.value.data["Prefix"] == "") alert("Network must have a valid Prefix");
        if(it.value.data["Netmask"] == "") alert("Network must have a valid Netmask");
    }
}

function validateHostsList(){
    hosts_list = myDiagram.findNodesByExample({category: "Hosts"});
    if(hosts_list === null) return;
    it = hosts_list.iterator;
    while(it.next()){
        if(it.value.data.text == "") alert("Host must have a valid name");
        if(it.value.data["Hosts"] == "") alert("Host List must have at least one host");
    }
}

function validateInternets(){
    internets = myDiagram.findNodesByExample({category: "Internet"});
    if(internets === null) return;
    it = internets.iterator;
    while(it.next()){
        if(it.value.data.text == "") alert("Internet must have a valid name");
    }
}

function validateIncomingTraffics(){
    incoming_traffics = myDiagram.findLinksByExample({category: "TrafegoEntrada"});
    if(incoming_traffics === null) return;
    it = incoming_traffics.iterator;
    while(it.next()){
        if(it.value.data.text == "") alert("Incoming Traffic must have a valid name");
        if(it.value.data["Source Port"] == "") alert("Incoming Traffic must have a valid Source Port");
        if(it.value.data["Protocols"] == "") alert("Incoming Traffic must have at least one protocol");
    }
}

function validateOutgoingTraffic(){
    outgoing_traffics = myDiagram.findLinksByExample({category: "TrafegoSaida"});
    if(outgoing_traffics === null) return;
    it = outgoing_traffics.iterator;
    while(it.next()){
        if(it.value.data.text == "") alert("Outgoing Traffic must have a valid name");
        if(it.value.data["Destiny Port"] == "") alert("Outgoing Traffic must have a valid Destiny Port");
        if(it.value.data["Traffic IDs"] == "") alert("Outgoing Traffic must have at least one Incoming Traffic");
    }
}

function validateBlockTraffic(){
    block_traffics = myDiagram.findLinksByExample({category: "TrafegoBloqueio"});
    if(block_traffics === null) return;
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
    if(redirect_traffics === null) return;
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
    if(outgoing_traffics === null) return;
    it = outgoing_traffics.iterator;
    while(it.next()){
        if(it.value.data.text == "") alert("NAT Traffic must have a valid name");
        if(it.value.data["Destiny Port"] == "") alert("NAT Traffic must have a valid Destiny Port");
        if(it.value.data["Traffic IDs"] == "") alert("NAT Traffic must have at least one Incoming Traffic");
    }
}
