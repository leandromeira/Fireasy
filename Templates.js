//--------------------------------------------//
//-------------NODES TEMPLATES----------------//
//--------------------------------------------//

function initializeNodeTemplates() {

    //HOSTS TEMPLATE
    myDiagram.nodeTemplateMap.add("Hosts",  // the category
        $(go.Node, "Table", nodeStyle(),
            {
                resizable: true,
                resizeObjectName: "SHAPE",
                selectionAdornmentTemplate: commandsAdornment_IN
            },
            // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
            $(go.Panel, "Auto",
                $(go.Shape, "DoubleRectangle", nodeShapeStyle()),
                $(go.TextBlock, textNodeStyle())
            ),
        ));

    //NETWORK TEMPLATE
    myDiagram.nodeTemplateMap.add("Network",  // the category
        $(go.Node, "Table", nodeStyle(),
            {
                resizable: true,
                resizeObjectName: "SHAPE",
                selectionAdornmentTemplate: commandsAdornment_IN
            },
            // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
            $(go.Panel, "Auto",
                $(go.Shape, "RoundedRectangle", nodeShapeStyle()),
                $(go.TextBlock, textNodeStyle())
            ),
        ));

    //NETWORK HOST
    myDiagram.nodeTemplateMap.add("Host",  // the category
        $(go.Node, "Table", nodeStyle(),
            {
                resizable: true,
                resizeObjectName: "SHAPE",
                selectionAdornmentTemplate: commandsAdornment_IN
            },
            // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
            $(go.Panel, "Auto",
                $(go.Shape, "Square", nodeShapeStyle()),
                $(go.TextBlock, textNodeStyle())
            ),
        ));

    //INTERFACE TEMPLATE
    myDiagram.nodeTemplateMap.add("Interface",  // the category
        $(go.Node, "Table", nodeStyle(),
            {
                resizable: false,
                resizeObjectName: "SHAPE",
                selectionAdornmentTemplate: commandsAdornment_OUT,
                movable: false,
                fromSpot: go.Spot.RightSide,
                toSpot: go.Spot.LeftSide
            },
            // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
            $(go.Panel, "Auto",
                $(go.Shape, "Rectangle",
                    {
                        name: "SHAPE",
                        // width: 70,
                        // height: 70,
                        height: 70,
                        width: 35,
                        fill: "#282c34",
                        stroke: "#00A9C9",
                        strokeWidth: 3.5,
                        cursor: "pointer",
                        portId: "",
                        fromLinkable: true, fromLinkableSelfNode: false, fromLinkableDuplicates: true,
                        toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true
                    },
                new go.Binding("fill", "Fill Color"),
                new go.Binding("stroke", "Stroke Color")),
                $(go.TextBlock, textNodeStyle())
            ),
        ));

    //INTERNET TEMPLATE
    myDiagram.nodeTemplateMap.add("Internet",
        $(go.Node, "Table", nodeStyle(),
            {
                resizable: true,
                resizeObjectName: "SHAPE",
                selectionAdornmentTemplate: commandsAdornment_IN
            },
            $(go.Panel, "Auto",
                $(go.Shape, "Cloud",nodeShapeStyle()),
                $(go.TextBlock, "Start", textNodeStyle())
            )
        ));

}

//--------------------------------------------//
//-------------GROUP TEMPLATES----------------//
//--------------------------------------------//

function initializeGroupTemplates(){
    myDiagram.groupTemplateMap.add( "Firewall",
        $(go.Group, go.Panel.Position,
            {
                isSubGraphExpanded: false,  // only show the Group itself, not any of its members
                ungroupable: false,
                resizable: false,
                computesBoundsAfterDrag: true,
                selectionObjectName: "SHAPE",
                visible: true,
                selectionAdornmentTemplate: firewallAdornment,
                resizeObjectName: "SHAPE",
                fromLinkable: false, fromLinkableSelfNode: false, fromLinkableDuplicates: false,
                toLinkable: false, toLinkableSelfNode: false, toLinkableDuplicates: false
            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            new go.Binding("visible","visible"),
            $(go.Panel, "Spot", {},
                $(go.Shape, "Circle",
                    {
                        name: "SHAPE",
                        // width: 70,
                        // height: 70,
                        desiredSize: new go.Size(80,80),
                        minSize: new go.Size(80,80),
                        fill: "#282c34",
                        stroke: "#00A9C9",
                        strokeWidth: 3.5,
                        cursor: "pointer",
                        portId: "",
                    },
                    new go.Binding("fill", "Fill Color"),
                    new go.Binding("stroke", "Stroke Color"),
                    new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                ),
                $(go.TextBlock, "Firewall", textNodeStyle()),
                $(go.Placeholder,    // represents the area of all member parts,
                    {
                        name: "placeholder",
                        alignment: go.Spot.Center
                    },
                )
            )
        )
    );
}

//--------------------------------------------//
//-------------LINKS TEMPLATES----------------//
//--------------------------------------------//

function initializeLinkTemplates() {
    myDiagram.linkTemplateMap.add("TrafegoEntrada",
        $(go.Link,
            // default routing is go.Link.Normal
            // default corner is 0
            {
                curve: go.Link.Bezier, reshapable: true,
                //routing: go.Link.AvoidsNodes,
                //corner: 10 ,
               // toShortLength: 0,
                // a mouse-over highlights the link by changing the first main path shape's stroke:
                mouseEnter: function(e, link) { link.elt(0).stroke = "rgba(0,90,156,0.3)"; },
                mouseLeave: function(e, link) { link.elt(0).stroke = "transparent"; }
            },
            new go.Binding("curviness", "curviness").makeTwoWay(),
            $(go.Shape, {
                isPanelMain: true,
                stroke: "transparent",
                strokeWidth: 8
            }),  // thick undrawn path
            // the link path, a Shape
            $(go.Shape, {
                    isPanelMain: true,
                    strokeWidth: 3,
                    stroke: "black"
                },
                new go.Binding("stroke", "color")),
            // if we wanted an arrowhead we would also add another Shape with toArrow defined:
            $(go.Shape,
                {
                    toArrow: "Standard",
                    stroke: null,
                    segmentOffset: new go.Point(-30, 0),
                    scale: 2
                },
                new go.Binding("fill", "color")),
            $(go.Shape,  // the label background, which becomes transparent around the edges
                {
                    fill: $(go.Brush, "Radial",
                    { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
                    stroke: null,
                    segmentIndex: 1
            }),
            $(go.TextBlock, textLinkStyle(),                        // Link label
                {
                    segmentIndex: 1,
                },    
                new go.Binding("text", "text").makeTwoWay()),
            $(go.Shape,  // the label background, which becomes transparent around the edges
                {
                    fill: $(go.Brush, "Radial",
                    { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
                    stroke: null,
                    segmentIndex: 2,
                    segmentFraction: -0.5
            }),
            $(go.TextBlock, textLinkStyle(),
                {
                    name: "ID",
                    editable: false,
                    segmentIndex: 2,
                    segmentFraction: -0.5
                },
                new go.Binding("text", "ID"))
        ));

    myDiagram.linkTemplateMap.add("TrafegoSaida",
        $(go.Link,
            // default routing is go.Link.Normal
            // default corner is 0
            {
                curve: go.Link.Bezier, reshapable: true,
                //routing: go.Link.AvoidsNodes,
                //corner: 10 ,
                //toShortLength: 0,
                // a mouse-over highlights the link by changing the first main path shape's stroke:
                mouseEnter: function(e, link) { link.elt(0).stroke = "rgba(0,90,156,0.3)"; },
                mouseLeave: function(e, link) { link.elt(0).stroke = "transparent"; }
            },
            new go.Binding("curviness", "curviness").makeTwoWay(),
            $(go.Shape, {
                isPanelMain: true,
                stroke: "transparent",
                strokeWidth: 8
            }),  // thick undrawn path
            // the link path, a Shape
            $(go.Shape, {
                isPanelMain: true,
                strokeWidth: 3,
                stroke: "blue"
            },
                new go.Binding("stroke", "color")),
            // if we wanted an arrowhead we would also add another Shape with toArrow defined:
            $(go.Shape,
                {
                    toArrow: "Standard",
                    stroke: "blue",
                    fill: "blue",
                    segmentOffset: new go.Point(-30, 0),
                    scale: 2
                },
                new go.Binding("fill", "color")),
            $(go.Shape,  // the label background, which becomes transparent around the edges
                {
                    fill: $(go.Brush, "Radial",
                    { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
                    stroke: null,
                    segmentIndex: 2
            }),
            $(go.TextBlock, textLinkStyle(),                     // Link label
                {
                    stroke: "blue",
                    segmentIndex: 2
                },
                new go.Binding("text", "text").makeTwoWay()),
            $(go.Shape,  // the label background, which becomes transparent around the edges
                {
                    fill: $(go.Brush, "Radial",
                    { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
                    stroke: null,
                    segmentIndex: 1,
                    segmentFraction: -0.5
            }),
            $(go.TextBlock, textLinkStyle(),
                {
                    name: "ID_in",
                    stroke: "blue",
                    editable: false,
                    segmentIndex: 1,
                    segmentFraction: -0.5
                },
                new go.Binding("text", "ID_in"))
        ));

    myDiagram.linkTemplateMap.add("TrafegoBloqueio",
        $(go.Link,
            // default routing is go.Link.Normal
            // default corner is 0
            {
                curve: go.Link.Bezier, reshapable: true,
                //routing: go.Link.AvoidsNodes,
                //corner: 10 ,
                //toShortLength: 0,
                // a mouse-over highlights the link by changing the first main path shape's stroke:
                mouseEnter: function(e, link) { link.elt(0).stroke = "rgba(0,90,156,0.3)"; },
                mouseLeave: function(e, link) { link.elt(0).stroke = "transparent"; }
            },
            new go.Binding("curviness", "curviness").makeTwoWay(),
            $(go.Shape, {
                isPanelMain: true,
                stroke: "transparent",
                strokeWidth: 8
            }),  // thick undrawn path
            // the link path, a Shape
            $(go.Shape, {
                isPanelMain: true,
                strokeWidth: 3,
                stroke: "red"
            },
                new go.Binding("stroke", "color")),
            // if we wanted an arrowhead we would also add another Shape with toArrow defined:
            $(go.Shape,
                {
                    toArrow: "Standard",
                    stroke: "red",
                    fill: "red",
                    segmentOffset: new go.Point(-30, 0),
                    scale: 2
                },
                new go.Binding("fill", "color")),
            $(go.Shape,  // the label background, which becomes transparent around the edges
                {
                    fill: $(go.Brush, "Radial",
                    { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
                    stroke: null,
                    segmentIndex: 1
            }),
            $(go.TextBlock, textLinkStyle(),                        // Link label
                {
                    stroke: "red",
                    segmentIndex: 1,
                },
                new go.Binding("text", "text").makeTwoWay()),
            $(go.Shape,  // the label background, which becomes transparent around the edges
                {
                    fill: $(go.Brush, "Radial",
                    { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
                    stroke: null,
                    segmentIndex: 2,
                    segmentFraction: -0.5
            }),
            $(go.TextBlock, textLinkStyle(),
                {
                    name: "ID",
                    editable: false,
                    segmentIndex: 2,
                    segmentFraction: -0.5,
                    stroke: "red"
                },
                new go.Binding("text", "ID"))
        ));

    myDiagram.linkTemplateMap.add("TrafegoRedirecionamento",
        $(go.Link,
            // default routing is go.Link.Normal
            // default corner is 0
            {
                curve: go.Link.Bezier, reshapable: true,
                //routing: go.Link.AvoidsNodes,
                //corner: 10 ,
                //toShortLength: 0,
                // a mouse-over highlights the link by changing the first main path shape's stroke:
                mouseEnter: function(e, link) { link.elt(0).stroke = "rgba(0,90,156,0.3)"; },
                mouseLeave: function(e, link) { link.elt(0).stroke = "transparent"; }
            },
            new go.Binding("curviness", "curviness").makeTwoWay(),
            $(go.Shape, {
                isPanelMain: true,
                stroke: "transparent",
                strokeWidth: 8
            }),  // thick undrawn path
            // the link path, a Shape
            $(go.Shape, {
                isPanelMain: true,
                strokeDashArray: [5,5],
                strokeWidth: 3,
                stroke: "black"
            },
                new go.Binding("stroke", "color")),
            // if we wanted an arrowhead we would also add another Shape with toArrow defined:
            $(go.Shape,
                {
                    toArrow: "Standard",
                    stroke: null,
                    segmentOffset: new go.Point(-30, 0),
                    scale: 2
                },
                new go.Binding("fill", "color")),
            $(go.Shape,  // the label background, which becomes transparent around the edges
                {
                    fill: $(go.Brush, "Radial",
                    { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
                    stroke: null,
                    segmentIndex: 1
            }),
            $(go.TextBlock, textLinkStyle(),  
                { 
                    segmentIndex: 1,
                },                      // Link label
                new go.Binding("text", "text").makeTwoWay()),
            $(go.Shape,  // the label background, which becomes transparent around the edges
                {
                    fill: $(go.Brush, "Radial",
                    { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
                    stroke: null,
                    segmentIndex: 2,
                    segmentFraction: -0.5
            }),
            $(go.TextBlock, textLinkStyle(),
                {
                    name: "ID",
                    editable: false,
                    segmentIndex: 2,
                    segmentFraction: -0.5
                },
                new go.Binding("text", "ID"))
        ));

    myDiagram.linkTemplateMap.add("TrafegoTraducao",
        $(go.Link,
            // default routing is go.Link.Normal
            // default corner is 0
            {
                curve: go.Link.Bezier, reshapable: true,
                //routing: go.Link.AvoidsNodes,
                //corner: 10 ,
                //toShortLength: 0,
                // a mouse-over highlights the link by changing the first main path shape's stroke:
                mouseEnter: function(e, link) { link.elt(0).stroke = "rgba(0,90,156,0.3)"; },
                mouseLeave: function(e, link) { link.elt(0).stroke = "transparent"; }
            },
            new go.Binding("curviness", "curviness").makeTwoWay(),
            $(go.Shape, {
                isPanelMain: true,
                stroke: "transparent",
                strokeWidth: 8
            }),  // thick undrawn path
            // the link path, a Shape
            $(go.Shape,
                {
                    isPanelMain: true,
                    strokeDashArray: [5,5],
                    strokeWidth: 3,
                    stroke: "blue"
                },
                new go.Binding("stroke", "color")),
            // if we wanted an arrowhead we would also add another Shape with toArrow defined:
            $(go.Shape,
                {
                    toArrow: "Standard",
                    stroke: "blue",
                    fill: "blue",
                    segmentOffset: new go.Point(-30, 0),
                    scale: 2
                },
                new go.Binding("fill", "color")),
            $(go.Shape,  // the label background, which becomes transparent around the edges
                {
                    fill: $(go.Brush, "Radial",
                    { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
                    stroke: null,
                    segmentIndex: 2,
            }),
            $(go.TextBlock, textLinkStyle(),                        // Link label
                {
                    stroke: "blue",
                    segmentIndex: 2,
                },
                new go.Binding("text", "text").makeTwoWay()),
            $(go.Shape,  // the label background, which becomes transparent around the edges
                {
                    fill: $(go.Brush, "Radial",
                    { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
                    stroke: null,
                    segmentIndex: 1,
                    segmentFraction: -0.5
            }),
            $(go.TextBlock, textLinkStyle(),
                {
                    name: "ID_in",
                    stroke: "blue",
                    editable: false,
                    segmentIndex: 1,
                    segmentFraction: -0.5
                },
                new go.Binding("text", "ID_in"))
        ));
}

//--------------------------------------------//
//----------------- STYLES -------------------//
//--------------------------------------------//

function textNodeStyle() {
    return [
        {
            name: "TEXT",
            font: "bold 11pt Lato, Helvetica, Arial, sans-serif",
            stroke: "#F8F8F8",
            margin: 8,
            //maxSize: new go.Size(160, NaN),
            wrap: go.TextBlock.WrapFit,
            overflow: go.TextBlock.OverflowEllipsis,
            editable: false,
            textAlign: "center",
            alignment: go.Spot.Center,
            isMultiline: true
        },
        new go.Binding("text").makeTwoWay(),
        new go.Binding("stroke", "Text Color")
    ]
}

function textLinkStyle(){
    return {
        //segmentOffset: new go.Point(0, -15),
        font: "bold 12pt serif"
    }
}

function nodeStyle() {
    return [
        // The Node.location comes from the "loc" property of the node data,
        // converted by the Point.parse static method.
        // If the Node.location is changed, it updates the "loc" property of the node data,
        // converting back using the Point.stringify static method.
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        {
            // the Node.location is at the center of each node
            locationSpot: go.Spot.Center,
            // shared selection Adornment
        }
    ];
}

function nodeShapeStyle(){
    return [
        {
            name: "SHAPE",
            // width: 70,
            // height: 70,
            desiredSize: new go.Size(80,80),
            minSize: new go.Size(80,80),
            fill: "#282c34",
            stroke: "#00A9C9",
            strokeWidth: 3.5,
            cursor: "pointer",
            portId: "",
            fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
            toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true
        },
        new go.Binding("fill", "Fill Color"),
        new go.Binding("stroke", "Stroke Color"),
        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),

    ]
}
