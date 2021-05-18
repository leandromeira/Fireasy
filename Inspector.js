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
                "Destiny Entity": {show: Inspector.showIfPresent, type: "select", choices: getEntities},
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
    
    if(property === "NAT"){
        link = myDiagram.selection.first();
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
    if(property === "Redirect Port"){
        link = myDiagram.selection.first();
        if(value === ""){
            if(link.data["category"]==="TrafegoRedirecionamento"){
                myDiagram.startTransaction("change link");
                myDiagram.model.setDataProperty(link.data, "category", "TrafegoEntrada");
                link.setProperties({
                    "ID.text": link.data.ID
                })
                // myDiagram.requestUpdate();
                myDiagram.commitTransaction("change link");
            }
            return;
        }
        if(!validatePort(value) || !validateCommaFreeName(node, value)) {
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
            link.setProperties({
                "ID.text": link.data.ID
            })
            myDiagram.commitTransaction("change link");
            return;
        }
    }
    if(property === "IP"){
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
    if(property === "Netmask"){
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
    if(property === "Device Name"){
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
    if(property === "Prefix"){
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
    if(property === "Source Port"){
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
    if(property === "Destiny Port"){
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
    if(property === "text"){
        //if(value === "") return;
        node = myDiagram.selection.first();
        if(node.data["category"]==="Firewall"){
            myDiagram.startTransaction("change interfaces firewall name ");
            changeInterfacesFirewallName(value);
            myDiagram.commitTransaction("change interfaces firewall name ");
            return;
        }
        if(!validateUniqueName(node,value)) {
            myDiagram.startTransaction("clear text");
            myDiagram.model.setDataProperty(node.data, "text", "");
            myDiagram.commitTransaction("clear text");
        }
    }
    if(property === "Incoming Traffics"){
        var selects = [];
        for(var i = 0; i < value.length; i++) {
            selects.push(value[i][0]);
        }
        link = myDiagram.selection.first();
        var intraffic = myDiagram.findLinksByExample({category: "TrafegoEntrada"} );
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
        for(var i=0; i < selects.length; i++) {
            while(it.next()){
                if(it.value.data["ID"]==selects[i]){
                    it.value.data["ID_out"] = link.data["ID"];
                }                
            }
            it.reset();
        }
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