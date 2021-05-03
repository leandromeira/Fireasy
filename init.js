var $;
var myDiagram;
var commandsAdornment;
var defaultNodeFillColor = "#282c34";
var defaultNodeStrokeColor= "#00A9C9";
var defaultTextcolor= "white";
var traffic_in_ids=1;
var traffic_blk_ids=1;

function init() {

    $ = go.GraphObject.make;
    myDiagram = $(go.Diagram, "DiagramDiv", {
        allowLink: false,  // linking is only started via buttons, not modelessly;
        linkingTool: new CustomLinkingTool(),  // defined below to automatically turn on allowLink
        "undoManager.isEnabled": true
    });

    firewallAdornment =
        $("ContextMenu",
            $(go.Panel, "Auto",
                $(go.Shape, {fill: null, stroke: "deepskyblue", strokeWidth: 2, shadowVisible: true}),
                $(go.Placeholder)
            ),
            new go.Binding("visible", "", isPallet).ofObject(),
            $(go.Panel, "Horizontal",
                {defaultStretch: go.GraphObject.Vertical, scale: 1.1},
                $("Button",
                    $(go.Shape,
                        {
                            figure: "Rectangle", width: 15, height: 20,
                            fill: null, stroke: "black", margin: 0, strokeWidth: 3
                        }),
                    $(go.TextBlock, "+",
                        {
                            margin: 8,
                            maxSize: new go.Size(160, NaN),
                            wrap: go.TextBlock.WrapFit,
                            editable: false,
                            font: "bold 12pt Lato, Helvetica, Arial, sans-serif"
                        }
                    ),
                    {click: addInterface, toolTip: makeTooltip("Add Interface")},
                    new go.Binding("visible", "", canAddInterface).ofObject()
                )
            )
        );

    commandsAdornment_IN =
        $("ContextMenu",
            $(go.Panel, "Auto",
                $(go.Shape, {fill: null, stroke: "deepskyblue", strokeWidth: 2, shadowVisible: true}),
                $(go.Placeholder)
            ),
            new go.Binding("visible", "", isPallet).ofObject(),
            $(go.Panel, "Horizontal",
                {defaultStretch: go.GraphObject.Vertical, scale: 1.1},
                $("Button",
                    $(go.Shape,
                        {
                            geometryString: "m 0 2 c 14 0 14 0 14 0 z M 6 0 F V 4 l -3 -2 z",
                            fill: "#000000", stroke: "black", strokeWidth: 1.5, margin: 0, scale: 1.5
                        }),
                    {click: startLinkIn, toolTip: makeTooltip("Liberar tráfego de entrada")},
                    new go.Binding("visible", "", canStartLink).ofObject()
                ),
                $("Button",
                    $(go.Shape,
                        {
                            geometryString: "m 0 2 c 14 0 14 0 14 0 z M 6 0 F V 4 l -3 -2 z",
                            fill: "red", stroke: "red", strokeWidth: 1.5, margin: 0, scale: 1.5
                        }),
                    { click: startLinkBlock, toolTip: makeTooltip("Bloquear Tráfego") },
                    new go.Binding("visible", "", canStartLink).ofObject()
                )
                // $("Button",
                //     $(go.Shape,
                //         {
                //             geometryString: "m 0 2 c 2 0 2 0 2 0 m 1 0 c 2 0 2 0 2 0 m 1 0 c 2 0 2 0 2 0 m 1 0 c 2 0 2 0 2 0 m 1 0 c 2 0 2 0 2 0 z M 7 0 F V 4 l 3 -2.0271 z",
                //             fill: "black", stroke: "black", margin: 0, strokeWidth: 1.5, scale: 1.5
                //         }),
                //     { click: startLinkRedirect, toolTip: makeTooltip("Redirecionar Tráfego") },
                //     new go.Binding("visible", "", canStartLink).ofObject()
                // ),
                // $("Button",
                //     $(go.Shape,
                //         {
                //             geometryString: "m 0 2 c 2 0 2 0 2 0 m 1 0 c 2 0 2 0 2 0 m 1 0 c 2 0 2 0 2 0 m 1 0 c 2 0 2 0 2 0 m 1 0 c 2 0 2 0 2 0 z M 7 0 F V 4 l 3 -2.0271 z",
                //             fill: "blue", stroke: "blue", margin: 0, strokeWidth: 1.5, scale: 1.5
                //         }),
                //     { click: startLinkTranslate, toolTip: makeTooltip("Traduzir Tráfego") },
                //     new go.Binding("visible", "", canStartLink).ofObject()
                // )
            )
        );

    commandsAdornment_OUT =
        $("ContextMenu",
            $(go.Panel, "Auto",
                $(go.Shape, {fill: null, stroke: "deepskyblue", strokeWidth: 2, shadowVisible: true}),
                $(go.Placeholder)
            ),
            new go.Binding("visible", "", isPallet).ofObject(),
            $(go.Panel, "Horizontal",
                {defaultStretch: go.GraphObject.Vertical, scale: 1.1},
                $("Button",
                    $(go.Shape,
                        {
                            geometryString: "m 0 2 c 14 0 14 0 14 0 z M 8 0 F V 4 l 3 -2.0271 z",
                            fill: "blue", stroke: "blue", strokeWidth: 1.5, margin: 0, scale: 1.5
                        }),
                    { click: startLinkOut, toolTip: makeTooltip("Liberar tráfego de saída") },
                    new go.Binding("visible", "", canStartLink).ofObject()
                )
                // $("Button",
                //     $(go.Shape,
                //         {
                //             geometryString: "m 0 2 c 2 0 2 0 2 0 m 1 0 c 2 0 2 0 2 0 m 1 0 c 2 0 2 0 2 0 m 1 0 c 2 0 2 0 2 0 m 1 0 c 2 0 2 0 2 0 z M 7 0 F V 4 l 3 -2.0271 z",
                //             fill: "black", stroke: "black", margin: 0, strokeWidth: 1.5, scale: 1.5
                //         }),
                //     { click: startLinkRedirect, toolTip: makeTooltip("Redirecionar Tráfego") },
                //     new go.Binding("visible", "", canStartLink).ofObject()
                // ),
                // $("Button",
                //     $(go.Shape,
                //         {
                //             geometryString: "m 0 2 c 2 0 2 0 2 0 m 1 0 c 2 0 2 0 2 0 m 1 0 c 2 0 2 0 2 0 m 1 0 c 2 0 2 0 2 0 m 1 0 c 2 0 2 0 2 0 z M 7 0 F V 4 l 3 -2.0271 z",
                //             fill: "blue", stroke: "blue", margin: 0, strokeWidth: 1.5, scale: 1.5
                //         }),
                //     { click: startLinkTranslate, toolTip: makeTooltip("Traduzir Tráfego") },
                //     new go.Binding("visible", "", canStartLink).ofObject()
                // )
            )
        );

    initializeNodeTemplates();
    initializeGroupTemplates();
    initializeLinkTemplates();

    function makeTooltip(str) {  // a helper function for defining tooltips for buttons
        return $("ToolTip",
            $(go.TextBlock, str));
    }

    var myPallet = $(go.Palette, "PaletteDiv",
        {
            //layout: $(go.GridLayout),
            padding: new go.Margin(70, 0, 0, 10,), //Desvia da marca d'agua do goJS
            nodeTemplateMap: myDiagram.nodeTemplateMap,
            groupTemplateMap: myDiagram.groupTemplateMap,
            model: new go.GraphLinksModel([
                {
                    category: "Firewall",
                    text: "Firewall",
                    isGroup: true,
                    visible: true,
                    "placeholder.alignment": go.Spot.Center,
                    "Fill Color": defaultNodeFillColor,
                    "Stroke Color": defaultNodeStrokeColor,
                    "Text Color": defaultTextcolor,
                    "Default Policy": "block"
                },
                {
                    category: "Host",
                    text: "Host",
                    "Fill Color": defaultNodeFillColor,
                    "Stroke Color": defaultNodeStrokeColor,
                    "Text Color": defaultTextcolor,
                    "IP": "",
                    "Netmask": ""
                },
                {
                    category: "Network",
                    text: "Network",
                    "Fill Color": defaultNodeFillColor,
                    "Stroke Color": defaultNodeStrokeColor,
                    "Text Color": defaultTextcolor,
                    "Prefix": "",
                    "Netmask": ""
                },
                {
                    category: "Hosts",
                    text: "Hosts",
                    "Fill Color": defaultNodeFillColor,
                    "Stroke Color": defaultNodeStrokeColor,
                    "Text Color": defaultTextcolor,
                    "Hosts": ""
                },
                {
                    category: "Internet",
                    text: "Internet",
                    "Fill Color": defaultNodeFillColor,
                    "Stroke Color": defaultNodeStrokeColor,
                    "Text Color": defaultTextcolor
                }
                // {
                //     category: "RDR",
                //     text: "RDR",
                //     "Fill Color": defaultNodeFillColor,
                //     "Stroke Color": defaultNodeStrokeColor,
                //     "Text Color": defaultTextcolor
                // }
            ])
        });


    var inspector = new Inspector('InspectorDiv', myDiagram,
        {
            // uncomment this line to only inspect the named properties below instead of all properties on each object:
            // includesOwnProperties: false,
            multipleSelection: false,
            properties: {
                "text": {show: Inspector.showIfPresent, type: "string"},
                "key": {readOnly: true, show: Inspector.showIfPresent},
                "Fill Color": {show: Inspector.showIfNode, type: 'color', defaultValue: defaultNodeFillColor},
                "Stroke Color": {show: Inspector.showIfNode, type: 'color', defaultValue: defaultNodeStrokeColor},
                "Text Color": {show: Inspector.showIfNode, type: 'color', defaultValue: defaultTextcolor},
                "figure": {show: false},
                "category": {show: Inspector.showIfLink, readOnly: true},
                "to": {show: Inspector.showIfLink},
                "loc": {show: false},
                "isGroup": {show: false},
                "placeholder.alignment": {show: false},
                "Default Colors": {show: Inspector.showIfNode, type: "checkbox", defaultValue: false},
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
                "Destiny Entities": {show: Inspector.showIfPresent, type: "select-multiple", choices: getEntities},
                "Source Port": {show: Inspector.showIfPresent},
                "Redirect Port": {show: Inspector.showIfPresent},
                "Destiny Port": {show: Inspector.showIfPresent},
                "NAT": {show: Inspector.showIfPresent, type: "checkbox", /*readOnly: true,*/ defaultValue: false},
                "Traffic IDs": {show: Inspector.showIfPresent, type: "select-multiple", choices: trafficIDs},
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

    function onPropertyChanged(property, value, inspec){
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
            if(link.data["category"]==="TrafegoEntrada"){
                myDiagram.startTransaction("change link");
                myDiagram.model.setDataProperty(link.data, "category", "TrafegoRedirecionamento");
                link.setProperties({
                    "ID.text": link.data.ID
                })
                // myDiagram.requestUpdate();
                myDiagram.commitTransaction("change link");
                return;
            }
        }
        if(property === "IP"){
            if(value === "") return;
            if(!validateIPaddress(value)) {
                alert("You have entered an invalid IP address!");
                var node = myDiagram.selection.first();
                myDiagram.startTransaction("clear IP");
                myDiagram.model.setDataProperty(node.data, "IP", "");
                myDiagram.commitTransaction("clear IP");
            }
        }
        if(property === "Netmask"){
            if(value === "") return;
            if(!validateNetmask(value)) {
                alert("You have entered an invalid netmask!");
                var node = myDiagram.selection.first();
                myDiagram.startTransaction("clear Netmask");
                myDiagram.model.setDataProperty(node.data, "Netmask", "");
                myDiagram.commitTransaction("clear Netmask");
            }
        }
        if(property === "Device Name"){
            if(value === "")return;
            if(!validateDeviceName(value)){
                alert("This interface name already exists!");
                var node = myDiagram.selection.first();
                myDiagram.startTransaction("clear Device Name");
                myDiagram.model.setDataProperty(node.data, "Device Name", "");
                myDiagram.commitTransaction("clear Device Name");
            }
        }
        if(property === "Prefix"){
            if(value === "") return;
            if(!validateIPaddress(value)) {
                alert("You have entered an invalid Prefix address!");
                var node = myDiagram.selection.first();
                myDiagram.startTransaction("clear Prefix");
                myDiagram.model.setDataProperty(node.data, "Prefix", "");
                myDiagram.commitTransaction("clear Prefix");
            }
        }

    }

    function validateDeviceName(inputText){
        interfaces = myDiagram.findNodesByExample({category: "Interface"});
        interfaces_array = [];
        it = interfaces.iterator;
        while(it.next()){
            //MUDAR ESSE "TEXT" PRA NOME FUTURAMENTE
            if(it.value.data["Device Name"]==="") continue;
            interfaces_array.push(it.value.data["Device Name"]);
        }
        console.log(interfaces_array.filter(item => item == inputText).length)
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

    function validateNetmask(inputText){
        intText = parseInt(inputText);
        if(intText<1 || intText>32) return false;
        return true;
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

    function isPallet(adorn) {
        var node = adorn.adornedPart;
        if (node.diagram instanceof go.Palette) return false;
        return true;
    }

    function canAddInterface(adorn) {
        var node = adorn.adornedPart;
        if (node.diagram instanceof go.Palette) return false;
        return true;
        // if (node.category === "" || node.category === "Start") {
        //     return node.findLinksOutOf().count === 0;
        // } else if (node.category === "Parallel" || node.category === "Exclusive") {
        //     return true;
        // }
        // return false;
    }

    function startLinkIn(e, obj) {
        startLink(obj.part.adornedPart, "TrafegoEntrada", "Entrada");
    }

    function startLinkOut(e, obj) {
        startLink(obj.part.adornedPart, "TrafegoSaida", "Saída");
    }

    function startLinkBlock(e, obj) {
        startLink(obj.part.adornedPart, "TrafegoBloqueio", "Bloquear");
    }

    function startLinkRedirect(e, obj) {
        startLink(obj.part.adornedPart, "TrafegoRedirecionamento", "Redirecionar");
    }

    function startLinkTranslate(e, obj) {
        startLink(obj.part.adornedPart, "TrafegoTraducao", "Traduzir");
    }

    function startLink(node, category, condition) {
        var tool = myDiagram.toolManager.linkingTool;
        // to control what kind of Link is created,
        // change the LinkingTool.archetypeLinkData's category
        myDiagram.model.setCategoryForLinkData(tool.archetypeLinkData, category);
        myDiagram.toolManager.linkingTool.temporaryLink = myDiagram.linkTemplateMap.get(category);
        // also change the text indicating the condition, which the user can edit
        tool.archetypeLinkData.text = condition;
        tool.startObject = node.port;
        myDiagram.currentTool = tool;
        tool.doActivate();
    }

    function canStartLink(adorn) {
        var node = adorn.adornedPart;
        return true;  // this could be smarter
    }


    myDiagram.toolManager.linkingTool.temporaryLink = myDiagram.linkTemplateMap.get("TrafegoSaida");

    function canLink(fromnode, fromport, tonode, toport) {
        if(fromnode.data.category == "Interface" && tonode.data.category == "Interface") return false;
        if(fromnode.data.category != "Interface" && tonode.data.category != "Interface") return false;
        return true;
    }

    myDiagram.toolManager.linkingTool.linkValidation = canLink;

    var tempfromnode =
        $(go.Node,
            { layerName: "Tool" },
            $(go.Shape, "RoundedRectangle",
                { stroke: "chartreuse", strokeWidth: 3, fill: null,
                    portId: "", width: 1, height: 1 })
        );
    myDiagram.toolManager.linkingTool.temporaryFromNode = tempfromnode;
    myDiagram.toolManager.linkingTool.temporaryFromPort = tempfromnode.port;

    var temptonode =
        $(go.Node,
            { layerName: "Tool" },
            $(go.Shape, "RoundedRectangle",
                { stroke: "cyan", strokeWidth: 3, fill: null,
                    portId: "", width: 1, height: 1 })
        );
    myDiagram.toolManager.linkingTool.temporaryToNode = temptonode;
    myDiagram.toolManager.linkingTool.temporaryToPort = temptonode.port;

    myDiagram.addDiagramListener("LinkDrawn", function (e) {
        link = e.subject.data;
        link2 = e.subject;
        //myDiagram.startTransaction("Set Link Attrs");
        from = myDiagram.model.findNodeDataForKey(myDiagram.model.getFromKeyForLinkData(link)).text
        //myDiagram.model.setDataProperty(link, "From", from);
        to = myDiagram.model.findNodeDataForKey(myDiagram.model.getToKeyForLinkData(link)).text
        //myDiagram.model.setDataProperty(link, "To", to);
        //myDiagram.commitTransaction("Set Link Attrs");
        switch (link.category) {
            case 'TrafegoEntrada':
                myDiagram.startTransaction("Set Link Attrs");
                myDiagram.model.setDataProperty(link, "text","Entrada");
                link2.setProperties({
                    "ID.text": traffic_in_ids
                });
                myDiagram.model.setDataProperty(link, "ID", traffic_in_ids);
                traffic_in_ids++;
                myDiagram.model.setDataProperty(link, "Source Port", "");
                myDiagram.model.setDataProperty(link, "Redirect Port", "");
                myDiagram.model.setDataProperty(link, "Protocols", "");
                myDiagram.model.setDataProperty(link, "AF", "inet");
                tointerface = myDiagram.findNodeForKey(myDiagram.model.getToKeyForLinkData(link));
                interface_device = tointerface.data["Device Name"];
                myDiagram.model.setDataProperty(link, "Interface", to+" ("+interface_device+")");
                myDiagram.model.setDataProperty(link, "External Entity", from);
                myDiagram.commitTransaction("Set Link Attrs");
                break;
            case 'TrafegoSaida':
                myDiagram.startTransaction("Set Link Attrs");
                frominterface = myDiagram.findNodeForKey(myDiagram.model.getFromKeyForLinkData(link));
                interface_device = frominterface.data["Device Name"];
                myDiagram.model.setDataProperty(link, "Interface", from+" ("+interface_device+")");
                myDiagram.model.setDataProperty(link, "External Entity", to);
                myDiagram.model.setDataProperty(link, "Destiny Port", "");
                myDiagram.model.setDataProperty(link, "NAT", false);
                myDiagram.model.setDataProperty(link, "Traffic IDs", "");
                myDiagram.commitTransaction("Set Link Attrs");
                break;
            case 'TrafegoBloqueio':
                myDiagram.startTransaction("Set Link Attrs");
                myDiagram.model.setDataProperty(link, "text", "Bloquear Entrada");
                link2.setProperties({
                    "ID.text": traffic_blk_ids
                });
                myDiagram.model.setDataProperty(link, "ID",traffic_blk_ids);
                traffic_blk_ids++;
                myDiagram.model.setDataProperty(link, "AF", "inet");
                tointerface = myDiagram.findNodeForKey(myDiagram.model.getToKeyForLinkData(link));
                interface_device = tointerface.data["Device Name"];
                myDiagram.model.setDataProperty(link, "Interface", to+" ("+interface_device+")");
                myDiagram.model.setDataProperty(link, "Source Entity", from);
                myDiagram.model.setDataProperty(link, "Destiny Entities", from);
                myDiagram.model.setDataProperty(link, "Source Port", "");
                myDiagram.model.setDataProperty(link, "Destiny Port", "");
                myDiagram.model.setDataProperty(link, "Protocols", "");
                myDiagram.commitTransaction("Set Link Attrs");
                break;
            case 'TrafegoRedirecionamento':
                myDiagram.startTransaction("Set Link Attrs");
                myDiagram.model.setDataProperty(link, "ID", "");
                myDiagram.model.setDataProperty(link, "Source Port", "");
                myDiagram.model.setDataProperty(link, "Redirect Port", "");
                myDiagram.model.setDataProperty(link, "Protocols", "");
                myDiagram.model.setDataProperty(link, "AF", "inet");
                tointerface = myDiagram.findNodeForKey(myDiagram.model.getToKeyForLinkData(link));
                interface_device = tointerface.data["Device Name"];
                myDiagram.model.setDataProperty(link, "Interface", to+" ("+interface_device+")");
                myDiagram.model.setDataProperty(link, "External Entity", from);
                myDiagram.commitTransaction("Set Link Attrs");
                break;
            case 'TrafegoTraducao' :
                myDiagram.startTransaction("Set Link Attrs");
                frominterface = myDiagram.findNodeForKey(myDiagram.model.getFromKeyForLinkData(link));
                interface_device = frominterface.data["Device Name"];
                myDiagram.model.setDataProperty(link, "Interface", from+" ("+interface_device+")");
                myDiagram.model.setDataProperty(link, "External Entity", to);
                myDiagram.model.setDataProperty(link, "Destiny Port", "");
                myDiagram.model.setDataProperty(link, "NAT", true);
                myDiagram.model.setDataProperty(link, "Traffic IDs", "");
                myDiagram.commitTransaction("Set Link Attrs");
                break;
            default:
        }
    });

    myDiagram.addDiagramListener("ChangedSelection", function (e) {
        // var nodes1 = myDiagram.model.nodeDataArray;
        // for (i = 0; i < nodes1.length; i++) {
        //     for (var [key, value] of Object.entries(nodes1[i])) {
        //         if(key==="category") console.log(value);
        //     }
        // }
        var select = myDiagram.selection.first();
        if (!(select instanceof go.Link)) return;
    });

    myDiagram.addDiagramListener("ExternalObjectsDropped", function (e) {
        // stop any ongoing text editing
        if (myDiagram.currentTool instanceof go.TextEditingTool) {
            myDiagram.currentTool.acceptText(go.TextEditingTool.LostFocus);
        }
        //verifica se está sendo solto um firewall dentro do diagrama.
        //se for, muda o alignment do placeholder do firewall pra BottomLeft, pra posicionar a primeira interface
        //seleciona apenas o grupo firewall, ao inves do firewall e a interface criada
        //expande o grupo que estava comprimido na pallet.
        if (e.subject.first().data.category === "Firewall") {
            firewall_pallet = myPallet.findNodesByExample({category: "Firewall"});
            firewall_pallet = firewall_pallet.iterator.first();
            myPallet.model.setDataProperty(firewall_pallet,"visible",false)
            addInterface();
            e.subject.first().setProperties({
                "placeholder.alignment": go.Spot.BottomLeft,
                "SHAPE.desiredSize": new go.Size(100, 100)
            })
            myDiagram.select(e.subject.first());
            myDiagram.commandHandler.expandSubGraph();
        }
    });

    myDiagram.addDiagramListener("SelectionDeleted", function (e) {
        if (e.subject.first().data.category === "Interface") {
            resizeFirewallDown(e.subject.first());
        }
        if (e.subject.first().data.category === "Firewall") {
            firewall_pallet = myPallet.findNodesByExample({category: "Firewall"});
            firewall_pallet = firewall_pallet.iterator.first();
            myPallet.model.setDataProperty(firewall_pallet,"visible",true);
        }

    });

    myDiagram.addModelChangedListener(function(evt) {
        // ignore unimportant Transaction events
        if (!evt.isTransactionFinished) return;
        var txn = evt.object;  // a Transaction
        if (txn === null) return;
        // iterate over all of the actual ChangedEvents of the Transaction
        txn.changes.each(function(e) {
            // ignore any kind of change other than adding/removing a node
            if (e.modelChange !== "nodeDataArray") return;
            // record node undo event
            if (e.change === go.ChangedEvent.Remove) return;
            if(evt.propertyName !== "FinishedUndo") return;
            if(e.newValue.category === "Firewall"){
                firewall_pallet = myPallet.findNodesByExample({category: "Firewall"});
                firewall_pallet = firewall_pallet.iterator.first();
                myPallet.model.setDataProperty(firewall_pallet,"visible",true);
            }
        });
    });

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
            text: "Int",
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

// This custom LinkingTool just turns on Diagram.allowLink when it starts,
// and turns it off again when it stops so that users cannot draw new links modelessly.
function CustomLinkingTool() {
    go.LinkingTool.call(this);
}
go.Diagram.inherit(CustomLinkingTool, go.LinkingTool);

// user-drawn linking is normally disabled,
// but needs to be turned on when using this tool
CustomLinkingTool.prototype.doStart = function() {
    myDiagram.startTransaction("allow link");
    this.diagram.allowLink = true;
    myDiagram.commitTransaction("allow link");
    go.LinkingTool.prototype.doStart.call(this);
};

CustomLinkingTool.prototype.doStop = function() {
    go.LinkingTool.prototype.doStop.call(this);
    myDiagram.startTransaction("allow link");
    this.diagram.allowLink = false;
    myDiagram.commitTransaction("allow link");
};
// end CustomLinkingTool

function toJson() {
    document.getElementById("JsonModel").value = myDiagram.model.toJson();
    myDiagram.isModified = false;
}