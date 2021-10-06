var $go;
var myDiagram;
var commandsAdornment;
var defaultNodeFillColor = "#282c34";
var defaultNodeStrokeColor= "#00A9C9";
var defaultTextcolor= "white";
var myPallet;
var myInspector;
var myInspectorColors;
var accordionJson;
var accordionSPML;
var accordionPacketFilter;
var show_unconnected_entities;


//IDs
var traffic_in_ids=1;
var traffic_out_ids=1;
var traffic_blk_ids=1;

//Counters
var host_count = 1;
var network_count = 1;
var hosts_count = 1;
var internet_count = 1;
var interface_count = 1;
var incoming_traffic_count = 1;
var outgoing_traffic_count = 1;
var block_traffic_count = 1;

//Objects with structure
var firewall;
var interfaces;
var hosts;
var unknown_networks;
var networks;
var hosts_list;
var incoming_traffics;
var outgoing_traffics;
var block_traffics;

function init() {

    $go = go.GraphObject.make;
    myDiagram = $go(go.Diagram, "DiagramDiv", {
        allowLink: false,  // linking is only started via buttons, not modelessly;
        linkingTool: new CustomLinkingTool(),  // defined below to automatically turn on allowLink
        "linkReshapingTool": new CurvedLinkReshapingTool(),
        "undoManager.isEnabled": true,
        layout: $go(go.ForceDirectedLayout, { isInitial: false, isOngoing: false }),
        "InitialLayoutCompleted": function(e) {
            // if not all Nodes have real locations, force a layout to happen
            if (!e.diagram.nodes.all(function(n) { return n.location.isReal(); })) {
                e.diagram.layoutDiagram(true);
            }
        }
    });

    charge = parseFloat(1000, 10);
    myDiagram.layout.defaultElectricalCharge = charge;

    defineAdornments();

    initializeNodeTemplates();
    initializeGroupTemplates();
    initializeLinkTemplates();

    myPallet = addPallet();
    myInspector = addInspector();
    myInspectorColors = addInspectorColors();

    defineListeners();

    myDiagram.toolManager.linkingTool.temporaryLink = myDiagram.linkTemplateMap.get("TrafegoSaida");

    function canLink(fromnode, fromport, tonode, toport) {
        if(fromnode.data.category == "Interface" && tonode.data.category == "Interface") return false;
        if(fromnode.data.category != "Interface" && tonode.data.category != "Interface") return false;
        return true;
    }

    myDiagram.toolManager.linkingTool.linkValidation = canLink;

    var tempfromnode =
        $go(go.Node,
            { layerName: "Tool" },
            $go(go.Shape, "RoundedRectangle",
                { stroke: "chartreuse", strokeWidth: 3, fill: null,
                    portId: "", width: 1, height: 1 })
        );
    myDiagram.toolManager.linkingTool.temporaryFromNode = tempfromnode;
    myDiagram.toolManager.linkingTool.temporaryFromPort = tempfromnode.port;

    var temptonode =
        $go(go.Node,
            { layerName: "Tool" },
            $go(go.Shape, "RoundedRectangle",
                { stroke: "cyan", strokeWidth: 3, fill: null,
                    portId: "", width: 1, height: 1 })
        );
    myDiagram.toolManager.linkingTool.temporaryToNode = temptonode;
    myDiagram.toolManager.linkingTool.temporaryToPort = temptonode.port;

    accordionJson = $( function() {
        $( "#json" ).accordion({
            collapsible: true,         
        });
    } );

    accordionSPML = $( function() {
        $( "#SPML" ).accordion({
            collapsible: true,
            active: false
        });
    } );

    accordionPacketFilter = $( function() {
        $( "#PacketFilter" ).accordion({
            collapsible: true,
            active:false
        });
    } );


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



function Load(){
    passwd = document.getElementById("password").value;
    if(passwd != "321stiOK") {
        alert("Incorrect password.");
        return;
    }
    //json = myDiagram.model.toJson();
    json = document.getElementById("JsonModel").value;
    myDiagram.model = go.Model.fromJson(json);
    updateAllCounters();
    setEmptyHostNetmasks();
    firewall = myDiagram.findNodesByExample({category: "Firewall"});
    if(firewall){
        firewall = firewall.iterator.first();
        onLoadFirewallSizeInterfaces(firewall)
        firewall.expandSubGraph();
        firewall_pallet = myPallet.findNodesByExample({category: "Firewall"});
        firewall_pallet = firewall_pallet.iterator.first();
        myPallet.model.setDataProperty(firewall_pallet,"visible",false);
    }   
}

function Translate() {
    passwd = document.getElementById("password").value;
    if(passwd != "321stiOK") {
        alert("Incorrect password.");
        return;
    }
    //if(document.getElementById("validation").checked) {
        validateAllFields();
    //}
    var json = document.getElementById("JsonModel").value;
    var spml =  translateMetaSPML(json);
    document.getElementById("SPMLModel").value = spml;
    objectifyMetaSPML(spml);    

    myDiagram.isModified = false;
}

function TranslatePacketFilter(){
    passwd = document.getElementById("password").value;
    if(passwd != "321stiOK") {
        alert("Incorrect password.");
        return;
    }
    var rules = TranslateToPacketFilter();
    document.getElementById("Packetfilter-rules").value = rules;
}

function LoadRules(){
    passwd = document.getElementById("password").value;
    if(passwd != "321stiOK") {
        alert("Incorrect password.");
        return;
    }
    var rules = document.getElementById("Packetfilter-rules").value;
    rules = clearCommentsAndEmptyLines(rules);
    if(ObjectifyPacketFilter(rules) != null){
        //mostrar a spml das regras
        spml = ObjectsToSPML();
        document.getElementById("SPMLModel").value = spml;
        var json = parseObjectsStructureToJson();
        document.getElementById("JsonModel").value = json;
    }
    Load();
        
}