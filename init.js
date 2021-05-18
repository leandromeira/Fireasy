var $;
var myDiagram;
var commandsAdornment;
var defaultNodeFillColor = "#282c34";
var defaultNodeStrokeColor= "#00A9C9";
var defaultTextcolor= "white";
var traffic_in_ids=1;
var traffic_out_ids=1;
var traffic_blk_ids=1;
var host_count = 1;
var network_count = 1;
var hosts_count = 1;
var internet_count = 1;
var interface_count = 1;
var incoming_traffic_count = 1;
var outgoing_traffic_count = 1;
var block_traffic_count = 1;
var myPallet;
var myInspector;
var myInspectorColors;

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

    $ = go.GraphObject.make;
    myDiagram = $(go.Diagram, "DiagramDiv", {
        allowLink: false,  // linking is only started via buttons, not modelessly;
        linkingTool: new CustomLinkingTool(),  // defined below to automatically turn on allowLink
        "undoManager.isEnabled": true
    });

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
    //json = myDiagram.model.toJson();
    json = document.getElementById("JsonModel").value;
    myDiagram.model = go.Model.fromJson(json);
    firewall = myDiagram.findNodeForKey(-1)
    onLoadFirewallSizeInterfaces(firewall)
    firewall.expandSubGraph();
}

function Translate() {
    //validateAllFields();
    json = myDiagram.model.toJson();
    document.getElementById("JsonModel").value = json;
    spml =  translateMetaSPML(json);
    document.getElementById("SPMLModel").value = spml;
    objectifyMetaSPML(spml);
    myDiagram.isModified = false;
}



function TranslatePacketFilter(){
    var rules = TranslateToPacketFilter();
    document.getElementById("Packetfilter-rules").value = rules;
}