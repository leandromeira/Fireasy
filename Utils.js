function isPallet(adorn) {
    var node = adorn.adornedPart;
    if (node.diagram instanceof go.Palette) return false;
    return true;
}

function makeTooltip(str) {  // a helper function for defining tooltips for buttons
    return $("ToolTip",
        $(go.TextBlock, str));
}

function getEntities(){
    hosts = myDiagram.findNodesByExample({category: "Host"});
    hosts_list = myDiagram.findNodesByExample({category: "Hosts"});
    network = myDiagram.findNodesByExample({category: "Network"});
    internet = myDiagram.findNodesByExample({category: "Internet"});

    choices = [];
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
    links = myDiagram.findLinksByExample({category: "TrafegoEntrada"} );
    choices = [];
    it = links.iterator;
    while(it.next()){
        //MUDAR ESSE "TEXT" PRA NOME FUTURAMENTE
        choices.push(it.value.data["ID"]+" - "+it.value.data["text"]);
    }
    return choices;
}

function getHosts(){
    hosts = myDiagram.findNodesByExample({category: "Host"});
    choices = [];
    it = hosts.iterator;
    while(it.next()){
        //MUDAR ESSE "TEXT" PRA NOME FUTURAMENTE
        choices.push(it.value.data["text"]+" - "+it.value.data["IP"]);
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
            "Firewall Name":  ""
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
            "placeholder.alignment": go.Spot.BottomLeft
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
