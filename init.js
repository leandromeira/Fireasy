var $;
var myDiagram;
var commandsAdornment;
var defaultNodeFillColor = "#282c34";
var defaultNodeStrokeColor= "#00A9C9";
var defaultTextcolor= "white";
var traffic_in_ids=1;
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

function toJson() {
    validateAllFields();
    document.getElementById("JsonModel").value = myDiagram.model.toJson();
    myDiagram.isModified = false;
}