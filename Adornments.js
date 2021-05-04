function defineAdornments(){
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
            )
        );
}

function canAddInterface(adorn) {
    var node = adorn.adornedPart;
    if (node.diagram instanceof go.Palette) return false;
    return true;
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