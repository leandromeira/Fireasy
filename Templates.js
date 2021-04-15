//--------------------------------------------//
//-------------NODES TEMPLATES----------------//
//--------------------------------------------//

function initializeNodeTemplates() {

    // // FIREWALL TEMPLATE
    // myDiagram.nodeTemplateMap.add("Firewall",
    //     $(go.Node, "Auto", nodeStyle(),
    //         {resizable: true, resizeObjectName: "SHAPE"},
    //         $(go.Panel, "Auto",
    //             $(go.Shape, "Circle",
    //                 {
    //                     name: "SHAPE",
    //                     //desiredSize: new go.Size(70, 70),
    //                     fill: "#282c34",
    //                     stroke: "#09d3ac",
    //                     strokeWidth: 3.5,
    //                     cursor: "pointer",
    //                     portId: "",
    //                     fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
    //                     toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true
    //                 },
    //                 new go.Binding("fill", "color")),
    //             $(go.TextBlock, "Start", textStyle(),
    //                 new go.Binding("text"),
    //                 {
    //                     editable: true
    //                 }
    //             )
    //         )
    //     ));

    //HOSTS TEMPLATE
    myDiagram.nodeTemplateMap.add("Hosts",  // the category
        $(go.Node, "Table", nodeStyle(),
            {
                resizable: true,
                resizeObjectName: "SHAPE",
                selectionAdornmentTemplate: commandsAdornment
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
                selectionAdornmentTemplate: commandsAdornment
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
                selectionAdornmentTemplate: commandsAdornment
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
                selectionAdornmentTemplate: commandsAdornment,
                movable: false
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
                        fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
                        toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true
                    },
                new go.Binding("fill", "Fill Color"),
                new go.Binding("stroke", "Stroke Color")),
                $(go.TextBlock, textNodeStyle())
            ),
        ));

    // //RDR TEMPLATE
    // myDiagram.nodeTemplateMap.add("RDR",  // the category
    //     $(go.Node, "Table", nodeStyle(),
    //         {
    //             resizable: true,
    //             resizeObjectName: "SHAPE",
    //             selectionAdornmentTemplate: commandsAdornment
    //         },
    //         // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
    //         $(go.Panel, "Auto",
    //             $(go.Shape, "RoundedSeparatedRectangle",nodeShapeStyle()),
    //             $(go.TextBlock, textNodeStyle())
    //         ),
    //     ));

    //INTERNET TEMPLATE
    myDiagram.nodeTemplateMap.add("Internet",
        $(go.Node, "Table", nodeStyle(),
            {
                resizable: true,
                resizeObjectName: "SHAPE",
                selectionAdornmentTemplate: commandsAdornment
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
                // layout:
                //     $(go.GridLayout,
                //         {
                //             alignment: go.GridLayout.Position,
                //             wrappingColumn: 1
                //         }
                //     ),
                selectionAdornmentTemplate: firewallAdornment,
                resizeObjectName: "SHAPE"
            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Panel, "Spot", {},
                $(go.Shape, "Circle", nodeShapeStyle(),
                    {
                        desiredSize: new go.Size(70, 70)
                    },
                    new go.Binding("desiredSize", "size")
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
                routing: go.Link.Orthogonal,
                corner: 5,
                toShortLength: 6
            },
            // the link path, a Shape
            $(go.Shape, {
                    strokeWidth: 3,
                    stroke: "black"
                },
                new go.Binding("stroke", "color")),
            // if we wanted an arrowhead we would also add another Shape with toArrow defined:
            $(go.Shape,
                {
                    toArrow: "Standard",
                    stroke: null,
                    segmentOffset: new go.Point(-10, 0),
                    scale: 2
                },
                new go.Binding("fill", "color")),
            $(go.TextBlock, textLinkStyle(),                        // Link label
                new go.Binding("text", "text"))
        ));

    myDiagram.linkTemplateMap.add("TrafegoSaida",
        $(go.Link,
            // default routing is go.Link.Normal
            // default corner is 0
            {
                routing: go.Link.Orthogonal,
                corner: 5,
                toShortLength: 6
            },
            // the link path, a Shape
            $(go.Shape, {
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
                    segmentOffset: new go.Point(-10, 0),
                    scale: 2
                },
                new go.Binding("fill", "color")),
            $(go.TextBlock, textLinkStyle(),                        // Link label
                new go.Binding("text", "text"))
        ));

    myDiagram.linkTemplateMap.add("TrafegoBloqueio",
        $(go.Link,
            // default routing is go.Link.Normal
            // default corner is 0
            {
                routing: go.Link.Orthogonal,
                corner: 5,
                toShortLength: 6
            },
            // the link path, a Shape
            $(go.Shape, {
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
                    segmentOffset: new go.Point(-10, 0),
                    scale: 2
                },
                new go.Binding("fill", "color")),
            $(go.TextBlock, textLinkStyle(),                        // Link label
                new go.Binding("text", "text"))
        ));

    myDiagram.linkTemplateMap.add("TrafegoRedirecionamento",
        $(go.Link,
            // default routing is go.Link.Normal
            // default corner is 0
            {
                routing: go.Link.Orthogonal,
                corner: 5,
                toShortLength: 6
            },
            // the link path, a Shape
            $(go.Shape, {
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
                    segmentOffset: new go.Point(-10, 0),
                    scale: 2
                },
                new go.Binding("fill", "color")),
            $(go.TextBlock, textLinkStyle(),                        // Link label
                new go.Binding("text", "text"))
        ));

    myDiagram.linkTemplateMap.add("TrafegoTraducao",
        $(go.Link,
            // default routing is go.Link.Normal
            // default corner is 0
            {
                routing: go.Link.Orthogonal,
                corner: 5,
                toShortLength: 6
            },
            // the link path, a Shape
            $(go.Shape, {
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
                    segmentOffset: new go.Point(-10, 0),
                    scale: 2
                },
                new go.Binding("fill", "color")),
            $(go.TextBlock, textLinkStyle(),                        // Link label
                new go.Binding("text", "text"))
        ));

    myDiagram.linkTemplateMap.add("FluxoSemControle",
        $(go.Link,
            // default routing is go.Link.Normal
            // default corner is 0
            {
                routing: go.Link.Orthogonal,
                corner: 5,
                toShortLength: 6
            },
            // the link path, a Shape
            $(go.Shape, {
                    strokeWidth: 3,
                    stroke: "#555"
                },
                new go.Binding("stroke", "color")),
            // if we wanted an arrowhead we would also add another Shape with toArrow defined:
            $(go.Shape,
                {
                    toArrow: "PartialDoubleTriangle",
                    stroke: null,
                    segmentOffset: new go.Point(-10, 0),
                    scale: 2
                },
                new go.Binding("fill", "color")),
            $(go.TextBlock, textLinkStyle(),                        // Link label
                new go.Binding("text", "text"))
        ));
}

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
            editable: true,
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
        segmentOffset: new go.Point(0, -10)
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
            desiredSize: new go.Size(70,70),
            minSize: new go.Size(70,70),
            fill: "#282c34",
            stroke: "#00A9C9",
            strokeWidth: 3.5,
            cursor: "pointer",
            portId: "",
            fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
            toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true
        },
        new go.Binding("fill", "Fill Color"),
        new go.Binding("stroke", "Stroke Color")

    ]
}
