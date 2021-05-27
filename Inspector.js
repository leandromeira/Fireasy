function addInspector(){
    myInspector = new Inspector('InspectorDiv', myDiagram,
        {
            // uncomment this line to only inspect the named properties below instead of all properties on each object:
            includesOwnProperties: false,
            multipleSelection: false,
            properties: {
                "text": {show: Inspector.showIfPresent, type: "string"},
                "key": {readOnly: true, show: Inspector.showIfPresent},
                "figure": {show: false},
                "category": {show: Inspector.showIfLink, readOnly: true},
                "to": {show: Inspector.showIfLink},
                "loc": {show: false},
                "size": {show: false},
                "isGroup": {show: false},
                "placeholder.alignment": {show: false},
                "Default Policy": { show: Inspector.showIfPresent, type: "select", choices: ["block", "permit"], defaultValue: "block"},
                "Device Name": {show: Inspector.showIfPresent, type: "text", defaultValue: ""},
                "IP": {show: Inspector.showIfPresent, type: "text", defaultValue: ""},
                "Prefix": {show: Inspector.showIfPresent, type: "text", defaultValue: ""},
                "Netmask": {show: Inspector.showIfPresent, type: "text", defaultValue: ""},
                "Firewall Name": {show: Inspector.showIfPresent, readOnly: true, type: "text"},
                "ID": {show: Inspector.showIfPresent, type: "number", readOnly: true},
                "Interface": {show: Inspector.showIfPresent, readOnly: true},
                "External Entity": {show: Inspector.showIfPresent, readOnly: true},
                "Source Entity": {show: Inspector.showIfPresent, readOnly: true},
                "Destiny Entity": {show: Inspector.showIfPresent, type: "select", choices: getEntities, defaultValue: ""},
                "Source Port": {show: Inspector.showIfPresent},
                "Redirect Port": {show: Inspector.showIfPresent},
                "Destiny Port": {show: Inspector.showIfPresent},
                "NAT": {show: Inspector.showIfPresent, type: "checkbox", /*readOnly: true,*/ defaultValue: false},
                "Incoming Traffics": {show: Inspector.showIfPresent, type: "select-multiple", choices: trafficIDs},
                "from": {show: false}, "to": {show: false},
                "From": {show: Inspector.showIfPresent, readOnly: true},
                "To": {show: Inspector.showIfPresent, readOnly: true},
                "Hosts": {show: Inspector.showIfPresent, type: "select-multiple", choices: getHosts},
                "Protocols":  {show: Inspector.showIfPresent, type: "select-multiple", choices: ["TCP","UDP","ICMP"]},
                "AF": {show: Inspector.showIfPresent, type: "select", choices: ["inet","inet6"], defaultValue: "inet"},
                "visible": {show: false},
                "group" : {show: false}
            },
            propertyModified: onPropertyChanged
        });

    return myInspector;
}

function addInspectorColors(){
    myInspector = new Inspector('InspectorDivColors', myDiagram,
        {
            // uncomment this line to only inspect the named properties below instead of all properties on each object:
            includesOwnProperties: false,
            multipleSelection: false,
            properties: {
                "Fill Color": {show: Inspector.showIfNode, type: 'color', defaultValue: defaultNodeFillColor},
                "Stroke Color": {show: Inspector.showIfNode, type: 'color', defaultValue: defaultNodeStrokeColor},
                "Text Color": {show: Inspector.showIfNode, type: 'color', defaultValue: defaultTextcolor},
                "figure": {show: false},
                "loc": {show: false},
                "size": {show: false},
                "isGroup": {show: false},
                "placeholder.alignment": {show: false},
                "Default Colors": {show: Inspector.showIfNode, type: "checkbox", defaultValue: false},
            },
            propertyModified: onPropertyChangedColors
        });

    return myInspector;
}

function onPropertyChanged(property, value, inspec){
    
    switch(property){
        case "NAT":
            onPropertyChangedNAT(value);
            break;
        case "Redirect Port":
            onPropertyChangedRedirectPort(value);
            break;
        case "IP":
            onPropertyChangedIP(value);
            break;
        case "Netmask":
            onPropertyChangedNetmask(value);
            break;
        case "Device Name":
            onPropertyChangedDeviceName(value);
            break;
        case "Prefix": 
            onPropertyChangedPrefix(value);
            break;
        case "Source Port":
            onPropertyChangedSourcePort(value);
            break;
        case "Destiny Port": 
            onPropertyChangedDestinyPort(value);
            break;
        case "text": 
            onPropertyChangedText(value);
            break;
        case "Incoming Traffics":
            onPropertyChangedIncomingTraffics(value);
            break;
        default: break;
    }   

}

function onPropertyChangedColors(property, value, inspec){
    if(property === "Default Colors"){
        if(value === true){
            var node = myDiagram.selection.first();
            myDiagram.startTransaction("restart colors");
            myDiagram.model.setDataProperty(node.data, "Fill Color", defaultNodeFillColor);
            myDiagram.model.setDataProperty(node.data, "Stroke Color", defaultNodeStrokeColor);
            myDiagram.model.setDataProperty(node.data, "Text Color", defaultTextcolor);
            myDiagram.commitTransaction("restart colors");
            setTimeout(function () {
                myDiagram.startTransaction("change checkbox state");
                myDiagram.model.setDataProperty(node.data, "Default Colors", false);
                myDiagram.commitTransaction("change checkbox state");
            }, 500);
        }
        return;
    }
}

function onPropertyChangedNAT(value){
    var link = myDiagram.selection.first();
    if(value === true){
        myDiagram.startTransaction("change link");
        myDiagram.model.setDataProperty(link.data, "category", "TrafegoTraducao");
        myDiagram.commitTransaction("change link");
        return;
    }
    myDiagram.startTransaction("change link");
    myDiagram.model.setDataProperty(link.data, "category", "TrafegoSaida");
    // myDiagram.requestUpdate();
    myDiagram.commitTransaction("change link");
    return;
}

function onPropertyChangedRedirectPort(value){
    link = myDiagram.selection.first();
    if(value === ""){
        if(link.data["category"]==="TrafegoRedirecionamento"){
            myDiagram.startTransaction("change link");
            myDiagram.model.setDataProperty(link.data, "category", "TrafegoEntrada");
            /*link.setProperties({
                "ID.text": link.data.ID
            })*/
            // myDiagram.requestUpdate();
            myDiagram.commitTransaction("change link");
        }
        return;
    }
    if(!validatePort(value, "rdr") || !validateCommaFreeName(node, value)) {
        alert("You have entered an invalid Redirect Port!");
        var node = myDiagram.selection.first();
        myDiagram.startTransaction("clear Redirect Port");
        myDiagram.model.setDataProperty(node.data, "Redirect Port", "");
        myDiagram.commitTransaction("clear Redirect Port");
        return;
    }
    if(link.data["category"]==="TrafegoEntrada"){
        myDiagram.startTransaction("change link");
        myDiagram.model.setDataProperty(link.data, "category", "TrafegoRedirecionamento");
        /*link.setProperties({
            "ID.text": link.data.ID
        })*/
        myDiagram.commitTransaction("change link");
        return;
    }
}

function onPropertyChangedIP(value){
    if(value.replace(/\s/g, '') === ""){
        var node = myDiagram.selection.first();
        if(node.category == "Host"){
            myDiagram.startTransaction("clear IP");
            myDiagram.model.setDataProperty(node.data, "IP", "any");
            myDiagram.commitTransaction("clear IP");
        }
        return;
    };
    if(!validateIPaddress(value) || !validateCommaFreeName(node, value)) {
        alert("You have entered an invalid IP address!");
        var node = myDiagram.selection.first();
        myDiagram.startTransaction("clear IP");
        myDiagram.model.setDataProperty(node.data, "IP", "");
        myDiagram.commitTransaction("clear IP");
        return;
    }
}

function onPropertyChangedNetmask(value){
    if(value === "") return;
    if(!validateNetmask(value) || !validateCommaFreeName(node, value)) {
        alert("You have entered an invalid netmask!");
        var node = myDiagram.selection.first();
        myDiagram.startTransaction("clear Netmask");
        myDiagram.model.setDataProperty(node.data, "Netmask", "");
        myDiagram.commitTransaction("clear Netmask");
        return;
    }
}

function onPropertyChangedDeviceName(value){
    if(value === "")return;
    if(!validateDeviceName(value) || !validateCommaFreeName(node, value)){
        alert("This interface name already exists!");
        var node = myDiagram.selection.first();
        myDiagram.startTransaction("clear Device Name");
        myDiagram.model.setDataProperty(node.data, "Device Name", "");
        myDiagram.commitTransaction("clear Device Name");
        return;
    }
}

function onPropertyChangedPrefix(value){
    if(value === "") return;
    if(!validateIPaddress(value) || !validateCommaFreeName(node, value)) {
        alert("You have entered an invalid Prefix address!");
        var node = myDiagram.selection.first();
        myDiagram.startTransaction("clear Prefix");
        myDiagram.model.setDataProperty(node.data, "Prefix", "");
        myDiagram.commitTransaction("clear Prefix");
        return;
    }
}

function onPropertyChangedSourcePort(value){
    if(value.replace(/\s/g, '') === "") {
        var node = myDiagram.selection.first();
        myDiagram.startTransaction("clear Source Port");
        myDiagram.model.setDataProperty(node.data, "Source Port", "*");
        myDiagram.commitTransaction("clear Source Port");
        return;
    }
    if(!validatePort(value) || !validateCommaFreeName(node, value)) {
        alert("You have entered an invalid Source Port!");
        var node = myDiagram.selection.first();
        myDiagram.startTransaction("clear Source Port");
        myDiagram.model.setDataProperty(node.data, "Source Port", "*");
        myDiagram.commitTransaction("clear Source Port");
        return;
    }
}

function onPropertyChangedDestinyPort(value){
    if(value.replace(/\s/g, '') === "") {
        var node = myDiagram.selection.first();
        myDiagram.startTransaction("clear Destiny Port");
        myDiagram.model.setDataProperty(node.data, "Destiny Port", "*");
        myDiagram.commitTransaction("clear Destiny Port");
        return;
    }
    if(!validatePort(value) || !validateCommaFreeName(node, value)) {
        alert("You have entered an invalid Destiny Port!");
        var node = myDiagram.selection.first();
        myDiagram.startTransaction("clear Destiny Port");
        myDiagram.model.setDataProperty(node.data, "Destiny Port", "*");
        myDiagram.commitTransaction("clear Destiny Port");
        return;
    }
}

function onPropertyChangedText(value){
    //if(value === "") return;
    node = myDiagram.selection.first();
    if(node.data["category"]==="Firewall"){
        myDiagram.startTransaction("change interfaces firewall name ");
        changeInterfacesFirewallName(value);
        myDiagram.commitTransaction("change interfaces firewall name ");
        return;
    }
    if(node.data["category"]==="TrafegoEntrada" || node.data["category"]=="TrafegoBloqueio" || node.data["category"]=="TrafegoRedirecionamento"){
        myDiagram.startTransaction("change traffic text");
        text = node.data.text;
        ID = node.data["ID"]
        myDiagram.model.setDataProperty(node.data, "text", ID+" | "+text);
        myDiagram.commitTransaction("change traffic text");
        return;
    }
    if(!validateUniqueName(node,value)) {
        myDiagram.startTransaction("clear text");
        myDiagram.model.setDataProperty(node.data, "text", "");
        myDiagram.commitTransaction("clear text");
        return;
    }
}

function onPropertyChangedIncomingTraffics(value){
    var selects = [];
    var selected ="";
    for(var i = 0; i < value.length; i++) {
        selected = value[i].split("|")[0];
        selected = selected.substring(0, selected.length-1);
        selects.push(selected);
    }
    link = myDiagram.selection.first();
    if(selects.length>0) {
        myDiagram.startTransaction("Change ID_in tag");
        myDiagram.model.setDataProperty(link.data, "ID_in", selects);
        text = link.data.text;
        myDiagram.model.setDataProperty(link.data, "text", text +" | "+selects);
        myDiagram.commitTransaction("Change ID_in tag");
    }
    if(selects.length==0){
        myDiagram.startTransaction("Change ID_in tag");
        myDiagram.model.setDataProperty(link.data, "ID_in", "");
        text = link.data.text;
        if(text.includes("|")){
            var text2 = text.split("|");
            text2 = text2[0].substring(0,text2[0].length-1);
            myDiagram.model.setDataProperty(link.data, "text", text2);
        }
        myDiagram.commitTransaction("Change ID_in tag");
    }
    
    var intraffic = myDiagram.findLinksByExample({category: "TrafegoEntrada"} );
    var rdrtraffics = myDiagram.findLinksByExample({category: "TrafegoRedirecionamento"} );
    it = intraffic.iterator;
    while(it.next()){ //verificar se removeu algum trafego de entrada
        if(it.value.data["ID_out"]==link.data["ID"]){
            if(selects.length==0){
                it.value.data["ID_out"] = null;
                continue;
            } 
            if(selects.includes(it.value.data["ID"])==false){
                it.value.data["ID_out"] = null;
            }                
        };
    }
    it.reset();
    //adiciona o trafego de saida no ID_out do trafego de entrada
    for(var i=0; i < selects.length; i++) {
        while(it.next()){
            if(it.value.data["ID"]==selects[i]){
                it.value.data["ID_out"] = link.data["ID"];
            }                
        }
        it.reset();
    }
    it = rdrtraffics.iterator;
    while(it.next()){ //verificar se removeu algum trafego de entrada
        if(it.value.data["ID_out"]==link.data["ID"]){
            if(selects.length==0){
                it.value.data["ID_out"] = null;
                continue;
            } 
            if(selects.includes(it.value.data["ID"])==false){
                it.value.data["ID_out"] = null;
            }                
        };
    }
    it.reset();
    //adiciona o trafego de saida no ID_out do trafego de entrada
    for(var i=0; i < selects.length; i++) {
        while(it.next()){
            if(it.value.data["ID"]==selects[i]){
                it.value.data["ID_out"] = link.data["ID"];
            }                
        }
        it.reset();
    }
}

