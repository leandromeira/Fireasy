const generic_json_header_firewall = "{ \"class\": \"GraphLinksModel\",\n  \"nodeDataArray\": [\n{\"category\":\"Firewall\", \"text\":\"Firewall\", \"isGroup\":true, \"visible\":true, \"placeholder.alignment\":{\"class\":\"go.Spot\",\"x\":0.5, \"y\":0.5, \"offsetX\":0, \"offsetY\":0}, \"Fill Color\":\"#282c34\", \"Stroke Color\":\"#00A9C9\", \"Text Color\":\"white\", \"key\":-1, \"loc\":\"-112.00000000000006 -142\",";
const generic_json_link_array_header = "],\n  \"linkDataArray\": [\n"
const generic_json_closing_chars = "]}"

function isPallet(adorn) {
    var node = adorn.adornedPart;
    if (node.diagram instanceof go.Palette) return false;
    return true;
}

function makeTooltip(str) {  // a helper function for defining tooltips for buttons
    return $go("ToolTip",
        $go(go.TextBlock, str));
}

function getEntities(){
    hosts = myDiagram.findNodesByExample({category: "Host"});
    hosts_list = myDiagram.findNodesByExample({category: "Hosts"});
    network = myDiagram.findNodesByExample({category: "Network"});
    internet = myDiagram.findNodesByExample({category: "Internet"});

    choices = [];
    choices.push("");
    it = hosts.iterator;
    while(it.next()){
        //MUDAR ESSE "TEXT" PRA NOME FUTURAMENTE
        choices.push(it.value.data["text"]);
    }
    it = hosts_list.iterator;
    while(it.next()){
        //MUDAR ESSE "TEXT" PRA NOME FUTURAMENTE
        choices.push(it.value.data["text"]);
    }
    it = network.iterator;
    while(it.next()){
        //MUDAR ESSE "TEXT" PRA NOME FUTURAMENTE
        choices.push(it.value.data["text"]);
    }
    it = internet.iterator;
    while(it.next()){
        //MUDAR ESSE "TEXT" PRA NOME FUTURAMENTE
        choices.push(it.value.data["text"]);
    }
    return choices;
}

function trafficIDs(){
    var intraffic = myDiagram.findLinksByExample({category: "TrafegoEntrada"} );
    var rdrtraffics = myDiagram.findLinksByExample({category: "TrafegoRedirecionamento"} );
    var outtraffic = myDiagram.selection.first();
    choices = [];
    it = intraffic.iterator;
    while(it.next()){
        //MUDAR ESSE "TEXT" PRA NOME FUTURAMENTE
        if(it.value.data["ID_out"] == outtraffic.data["ID"] || it.value.data["ID_out"] == null)
            choices.push(it.value.data["text"]);
    }
    it = rdrtraffics.iterator;
    while(it.next()){
        //MUDAR ESSE "TEXT" PRA NOME FUTURAMENTE
        if(it.value.data["ID_out"] == outtraffic.data["ID"] || it.value.data["ID_out"] == null)
            choices.push(it.value.data["text"]);
    }
    return choices;
}

function getHosts(){
    hosts = myDiagram.findNodesByExample({category: "Host"});
    choices = [];
    it = hosts.iterator;
    while(it.next()){
        //MUDAR ESSE "TEXT" PRA NOME FUTURAMENTE
        choices.push(it.value.data["text"]/*+" - "+it.value.data["IP"]*/);
    }
    return choices;
}

function resizeFirewallUp(firewall){
    count = firewall.memberParts.count;
    if (count === 1) {
        firewall.setProperties({
            "placeholder.alignment": go.Spot.Center
        });
        firewall.layout = new go.CircularLayout;
        firewall.layout.startAngle = 45;
        firewall.layout.radius = 70;
    }
    else if(count >3){
        firewall.layout.startAngle= 0;
        if(count>4){
            shape = firewall.findObject("SHAPE");
            x = shape.width;
            y = shape.height;
            if(count<9) shape.desiredSize = new go.Size(x+(6*count+1), y+(6*count+1));
            else shape.desiredSize = new go.Size(x+(2*count+1), y+(2*count+1));
        }
    }
}

function addInterface() {
    //verifica o layout do group
    //se ainda for Position. muda pra circular.
    var firewall = myDiagram.selection.first();
    myDiagram.startTransaction("make new interface");
    resizeFirewallUp(firewall);
    myDiagram.model.addNodeData(
        {
            category: "Interface",
            text: "Int"+interface_count,
            group: firewall.data.key,
            "Fill Color": defaultNodeFillColor,
            "Stroke Color": defaultNodeStrokeColor,
            "Text Color": defaultTextcolor,
            "Device Name": "",
            "IP": "",
            "Netmask": "",
            "Firewall Name":  firewall.data.text
        }
    );
    interface_count++;
    myDiagram.commitTransaction("make new interface");
}

function resizeFirewallDown(interface){
    firewall= interface.findTopLevelPart();
    count = firewall.memberParts.count;
    if (count === 1) {
        firewall.setProperties({
            "placeholder.alignment": go.Spot.BottomLeft,
            "SHAPE.desiredSize": new go.Size(100, 100)
        });
    }
    else if(count >1 && count <=3){
        firewall.layout.startAngle= 45;
        firewall.setProperties({
            "SHAPE.desiredSize": new go.Size(100, 100)
        });
    }
    else if(count >3){
        firewall.layout.startAngle= 45;
        if (count ===4) firewall.findObject("SHAPE").desiredSize= new go.Size(100,100);
        if(count>4){
            shape = firewall.findObject("SHAPE");
            x = shape.width;
            y = shape.height;
            if(count>9) shape.desiredSize = new go.Size(x-(2*count+1), y-(2*count+1));
            else shape.desiredSize = new go.Size(x-(5*count+1), y-(5*count+1));
        }
    }
}

function changeInterfacesFirewallName(name){
    interfaces = myDiagram.findNodesByExample({category: "Interface"});
    it = interfaces.iterator;
    while(it.next()){
        //MUDAR ESSE "TEXT" PRA NOME FUTURAMENTE
        it.value.data["Firewall Name"] = name
    }
}

function onLoadFirewallSizeInterfaces(firewall){
    interfaces = firewall.memberParts.count;
    if(interfaces == 1){
        firewall.setProperties({
            "placeholder.alignment": go.Spot.BottomLeft
        });
        return;
    }
    firewall.layout = new go.CircularLayout;
    firewall.layout.radius = 70;
    if(interfaces >4) {
        firewall.layout.startAngle = 0;
        return;
    }
    firewall.layout.startAngle = 45;
}

function updateAllCounters(){
    var interfaces_diagram = myDiagram.findNodesByExample({category: "Interface"});
    interface_count = interfaces_diagram.count+1;

    var host_diagram = myDiagram.findNodesByExample({category: "Host"});
    host_count = host_diagram.count+1;

    var hosts_diagram = myDiagram.findNodesByExample({category: "Hosts"});
    hosts_count = hosts_diagram.count+1;

    var network_diagram = myDiagram.findNodesByExample({category: "Network"});
    network_count = network_diagram.count+1;

    var internet_diagram = myDiagram.findNodesByExample({category: "Internet"});
    internet_count = internet_diagram.count+1;

    var incoming_diagram = myDiagram.findLinksByExample({category: "TrafegoEntrada"});
    incoming_traffic_count = incoming_diagram.count;

    var rdr_diagram = myDiagram.findLinksByExample({category: "TrafegoRedirecionamento"});
    incoming_traffic_count += rdr_diagram.count+1;

    var outgoing_diagram = myDiagram.findLinksByExample({category: "TrafegoSaida"});
    outgoing_traffic_count = outgoing_diagram.count;

    var nat_diagram = myDiagram.findLinksByExample({category: "TrafegoTraducao"});
    outgoing_traffic_count += nat_diagram.count+1;

    var block_diagram = myDiagram.findLinksByExample({category: "TrafegoBloqueio"});
    block_traffic_count = block_diagram.count+1;

    //IDs
    var maior=0;
    it = incoming_diagram.iterator;
    while(it.next()){
        if(it.value.data["ID"] > maior)
            maior = it.value.data["ID"]
    }
    it =  rdr_diagram.iterator;
    while(it.next()){
        if(it.value.data["ID"] > maior)
            maior = it.value.data["ID"]
    }
    traffic_in_ids = maior+1;
    
    maior=0;
    it = outgoing_diagram.iterator;
    while(it.next()){
        if(it.value.data["ID"] > maior)
            maior = it.value.data["ID"]
    }
    it = nat_diagram.iterator;
    while(it.next()){
        if(it.value.data["ID"] > maior)
            maior = it.value.data["ID"]
    }
    traffic_out_ids = maior+1;

    maior=0;
    it = block_diagram.iterator;
    while(it.next()){
        if(it.value.data["ID"] > maior)
            maior = it.value.data["ID"]
    }
    traffic_blk_ids = maior+1;
}

function deletingIncomingTraffic(traffic){
    var out_traffics = myDiagram.findLinksByExample({category: "TrafegoSaida"});
    var nat_traffics = myDiagram.findLinksByExample({category: "TrafegoTraducao"});
    var it = out_traffics.iterator;
    loop1: while(it.next()){
        for(var i=0; i<it.value.data["Incoming Traffics"].length;i++){
            in_traffic = it.value.data["Incoming Traffics"][i].split("|");
            in_traffic = in_traffic[0].trim()
            if(in_traffic == traffic.ID) {
                it.value.data["Incoming Traffics"].splice(i,1);
                var selects = [];
                var selected ="";
                for(var i = 0; i < it.value.data["Incoming Traffics"].length; i++) {
                    selected = it.value.data["Incoming Traffics"][i].split("|")[0];
                    selected = selected.trim();
                    selects.push(selected);
                }
                if(selects.length>0) {
                    myDiagram.startTransaction("Change ID_in tag");
                    myDiagram.model.setDataProperty(it.value.data, "ID_in", selects);
                    text = it.value.data.text;
                    var text2 = text.split("|");
                    text2 = text2[0].substring(0,text2[0].length-1);
                    myDiagram.model.setDataProperty(it.value.data, "text", text2 +" | "+selects);
                    myDiagram.commitTransaction("Change ID_in tag");
                }
                if(selects.length==0){
                    myDiagram.startTransaction("Change ID_in tag");
                    myDiagram.model.setDataProperty(it.value.data, "ID_in", "");
                    text = it.value.data.text;
                    if(text.includes("|")){
                        var text2 = text.split("|");
                        text2 = text2[0].substring(0,text2[0].length-1);
                        myDiagram.model.setDataProperty(it.value.data, "text", text2);
                    }
                    myDiagram.commitTransaction("Change ID_in tag");
                }
                    break loop1;
            }
        }
    }
    it = nat_traffics.iterator;
    loop2: while(it.next()){
        for(var i=0; i<it.value.data["Incoming Traffics"].length;i++){
            in_traffic = it.value.data["Incoming Traffics"][i].split("|");
            in_traffic = in_traffic[0].trim()
            if(in_traffic == traffic.ID) {
                it.value.data["Incoming Traffics"].splice(i,1);
                var selects = [];
                var selected ="";
                for(var i = 0; i < it.value.data["Incoming Traffics"].length; i++) {
                    selected = it.value.data["Incoming Traffics"][i].split("|")[0];
                    selected = selected.trim();
                    selects.push(selected);
                }
                if(selects.length>0) {
                    myDiagram.startTransaction("Change ID_in tag");
                    myDiagram.model.setDataProperty(it.value.data, "ID_in", selects);
                    text = it.value.data.text;
                    var text2 = text.split("|");
                    text2 = text2[0].substring(0,text2[0].length-1);
                    myDiagram.model.setDataProperty(it.value.data, "text", text2 +" | "+selects);
                    myDiagram.commitTransaction("Change ID_in tag");
                }
                if(selects.length==0){
                    myDiagram.startTransaction("Change ID_in tag");
                    myDiagram.model.setDataProperty(it.value.data, "ID_in", "");
                    text = it.value.data.text;
                    if(text.includes("|")){
                        var text2 = text.split("|");
                        text2 = text2[0].substring(0,text2[0].length-1);
                        myDiagram.model.setDataProperty(it.value.data, "text", text2);
                    }
                    myDiagram.commitTransaction("Change ID_in tag");
                }
                    break loop2;
            }
        }
    }

}

function deletingOutgoingTraffic(traffic){
    if(traffic["Incoming Traffics"].length==0) return;
    for(var i=0;i<traffic["Incoming Traffics"].length;i++){
        id = traffic["Incoming Traffics"][i].split("|");
        id = id[0].trim();
        in_traffic = findIncomingTrafficByID(id);
        in_traffic["ID_out"]=null;
    }
}

function findIncomingTrafficByID(id){
    var in_traffics = myDiagram.findLinksByExample({category: "TrafegoEntrada"});
    var it = in_traffics.iterator;
    while(it.next()){
        if(it.value.data.ID == id) return it.value.data;
    }
    var rdr_traffics = myDiagram.findLinksByExample({category: "TrafegoRedirecionamento"});
    var it = rdr_traffics.iterator;
    while(it.next()){
        if(it.value.data.ID == id) return it.value.data;
    }
}

function deletingNode(value){
    var in_interface = value.findLinksInto();
    var out_interface = value.findLinksOutOf();
    in_traffics = [];
    out_traffics = [];
    var it = in_interface.iterator;
    while(it.next()){
        if(it.value.data.category == "TrafegoBloqueio") continue;
        in_traffics.push(it.value.data);
    }
    it = out_interface.iterator;
    while(it.next()){
        out_traffics.push(it.value.data);
    }
    for(var i=0; i<in_traffics.length; i++){
        if(value.data.category== "Interface"){
            deletingIncomingTraffic(in_traffics[i]);
            continue;
        }
        deletingOutgoingTraffic(in_traffics[i]);
    }
    for(var i=0; i<out_traffics.length; i++){
        if(value.data.category== "Interface"){
            deletingOutgoingTraffic(out_traffics[i]);
            continue;
        }
        deletingIncomingTraffic(out_traffics[i]);
    }
}

function deletingHost(value){
    //faz as alterações necessárias nos tráfegos
    deletingNode(value);
    //deleta o host de todas as HostLists que ele estava presente
    var hosts = myDiagram.findNodesByExample({category: "Hosts"});
    var it = hosts.iterator;
    while(it.next()){
        if( it.value.data["Hosts"].includes(value.data.text)) 
            it.value.data["Hosts"].splice(it.value.data["Hosts"].indexOf(value.data.text), 1);
    }
    //verifica se algum tráfego de bloqueio tinha como destinyEntity esse hosts, se sim, limpa o camp do tráfego de bloqueio
    var block_traffics = myDiagram.findLinksByExample({category: "TrafegoBloqueio"});
    it = block_traffics.iterator;
    while(it.next()){
        if( it.value.data["Destiny Entity"] == value.data.text) {
            myDiagram.startTransaction("Empty destiny entity");
            myDiagram.model.setDataProperty(it.value.data, "Destiny Entity", "");
            myDiagram.commitTransaction("Empty destiny entity");
        }
    }
}

function setEmptyHostNetmasks(){
    var hosts = myDiagram.findNodesByExample({category: "Host"});
    it = hosts.iterator;
    while(it.next()){
        if(it.value.data["Netmask"] == ""){
            it.value.data["Netmask"] = "24";
        }
    }
}

function clearCommentsAndEmptyLines(lines){    
    lines = lines.split("\n"); 
    clean = [];   
    for(var i=0; i<lines.length;i++){        
        line = lines[i].replace(/\s/g, ''); 
        //line = lines[i]
        //console.log(line)
        if(!line.includes("#") && line != ""){
            clean.push(lines[i]);
            //lines.splice(i,1);
        }            
    }
    return clean;
}

function redefineStructureObjects(){
    firewall = null;
    interfaces = null;
    hosts = null;
    unknown_networks = null;
    networks = null;
    hosts_list = null;
    incoming_traffics = null;
    outgoing_traffics = null;
    block_traffics = null;
}

function redefineCounters(){
    host_count = 1;
    network_count = 1;
    hosts_count = 1;
    internet_count = 1;
    interface_count = 1;
    incoming_traffic_count = 1;
    outgoing_traffic_count = 1;
    block_traffic_count = 1;
}

function redefineTrafficIDSCounters(){
    traffic_in_ids=1;
    traffic_out_ids=1;
    traffic_blk_ids=1;
}