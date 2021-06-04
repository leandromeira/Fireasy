function addPallet(){
    myPallet = $go(go.Palette, "PaletteDiv",
        {
            //layout: $go(go.GridLayout),
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
                    "Netmask": "24"
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
            ])
        });
    return myPallet;
}