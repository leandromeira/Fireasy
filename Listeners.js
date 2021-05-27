function defineListeners(){

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
        if(e.subject.first().data.category === "Host"){
            e.subject.first().setProperties({
                "TEXT.text": "Host"+host_count
            })
            host_count++;
        }
        if(e.subject.first().data.category === "Hosts"){
            e.subject.first().setProperties({
                "TEXT.text": "Hosts"+hosts_count
            })
            hosts_count++;
        }
        if(e.subject.first().data.category === "Network"){
            e.subject.first().setProperties({
                "TEXT.text": "Network"+network_count
            })
            network_count++;
        }
        if(e.subject.first().data.category === "Internet"){
            e.subject.first().setProperties({
                "TEXT.text": "Internet"+internet_count
            })
            internet_count++;
        }
    });

    myDiagram.addDiagramListener("ChangedSelection", function (e) {
        var select = myDiagram.selection.first();
        if (!(select instanceof go.Link)) return;
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

    myDiagram.addDiagramListener("SelectionDeleting", function (e) {
        var it = e.subject.iterator;
        var category;
        while (it.next()) {
            category = it.value.data.category;
            switch (category){
                case "Interface":

                    break;
                case "Host":

                    break;
                case "Hots":
                case "Network":
                case "Internet":
                    
                    break;
                case "TrafegoEntrada":
                case "TrafegoRedirecionamento":
                    deletingIncomingTraffic(it.value.data);
                    break;
                case "TrafegoSaida":
                case "TrafegoTraducao":
                    deletingOutgoingTraffic(it.value.data);
                    break;
                default: break;
            }
        }

        //console.log(e.subject.count);
        if(e.subject.first().data.category == "Firewall"){
           console.log("firewall")
        }
    });

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
                myDiagram.model.setDataProperty(link, "text",traffic_in_ids+" | Incoming Traffic "+incoming_traffic_count);
                incoming_traffic_count++;
                /*link2.setProperties({
                    "ID.text": traffic_in_ids
                });*/
                myDiagram.model.setDataProperty(link, "ID", traffic_in_ids);
                traffic_in_ids++;
                myDiagram.model.setDataProperty(link, "Source Port", "*");
                myDiagram.model.setDataProperty(link, "Redirect Port", "");
                myDiagram.model.setDataProperty(link, "Protocols", "");
                myDiagram.model.setDataProperty(link, "AF", "inet");
                tointerface = myDiagram.findNodeForKey(myDiagram.model.getToKeyForLinkData(link));
                interface_device = tointerface.data["Device Name"];
                myDiagram.model.setDataProperty(link, "Interface", to);
                myDiagram.model.setDataProperty(link, "External Entity", from);
                myDiagram.model.setDataProperty(link, "ID_out", null);
                myDiagram.commitTransaction("Set Link Attrs");
                break;
            case 'TrafegoSaida':
                myDiagram.startTransaction("Set Link Attrs");
                myDiagram.model.setDataProperty(link, "text","Outgoing Traffic "+outgoing_traffic_count);
                outgoing_traffic_count++;
                myDiagram.model.setDataProperty(link, "ID", traffic_out_ids);
                traffic_out_ids++;
                frominterface = myDiagram.findNodeForKey(myDiagram.model.getFromKeyForLinkData(link));
                interface_device = frominterface.data["Device Name"];
                myDiagram.model.setDataProperty(link, "Interface", from);
                myDiagram.model.setDataProperty(link, "External Entity", to);
                myDiagram.model.setDataProperty(link, "Destiny Port", "*");
                myDiagram.model.setDataProperty(link, "NAT", false);
                myDiagram.model.setDataProperty(link, "Incoming Traffics", "");
                myDiagram.commitTransaction("Set Link Attrs");
                break;
            case 'TrafegoBloqueio':
                myDiagram.startTransaction("Set Link Attrs");
                myDiagram.model.setDataProperty(link, "text", traffic_blk_ids+" | "+"Block Incoming "+block_traffic_count);
                block_traffic_count++;
                /*link2.setProperties({
                    "ID.text": traffic_blk_ids
                });*/
                myDiagram.model.setDataProperty(link, "ID",traffic_blk_ids);
                traffic_blk_ids++;
                myDiagram.model.setDataProperty(link, "AF", "inet");
                tointerface = myDiagram.findNodeForKey(myDiagram.model.getToKeyForLinkData(link));
                interface_device = tointerface.data["Device Name"];
                myDiagram.model.setDataProperty(link, "Interface", to);
                myDiagram.model.setDataProperty(link, "Source Entity", from);
                myDiagram.model.setDataProperty(link, "Destiny Entity", "");
                myDiagram.model.setDataProperty(link, "Source Port", "*");
                myDiagram.model.setDataProperty(link, "Destiny Port", "*");
                myDiagram.model.setDataProperty(link, "Protocols", "");
                myDiagram.commitTransaction("Set Link Attrs");
                break;
            case 'TrafegoRedirecionamento':
                myDiagram.startTransaction("Set Link Attrs");
                myDiagram.model.setDataProperty(link, "ID", "");
                myDiagram.model.setDataProperty(link, "Source Port", "*");
                myDiagram.model.setDataProperty(link, "Redirect Port", "");
                myDiagram.model.setDataProperty(link, "Protocols", "");
                myDiagram.model.setDataProperty(link, "AF", "inet");
                tointerface = myDiagram.findNodeForKey(myDiagram.model.getToKeyForLinkData(link));
                interface_device = tointerface.data["Device Name"];
                myDiagram.model.setDataProperty(link, "Interface", to);
                myDiagram.model.setDataProperty(link, "External Entity", from);
                myDiagram.model.setDataProperty(link, "ID_out", null);
                myDiagram.commitTransaction("Set Link Attrs");
                break;
            case 'TrafegoTraducao' :
                myDiagram.startTransaction("Set Link Attrs");
                frominterface = myDiagram.findNodeForKey(myDiagram.model.getFromKeyForLinkData(link));
                interface_device = frominterface.data["Device Name"];
                myDiagram.model.setDataProperty(link, "Interface", from);
                myDiagram.model.setDataProperty(link, "External Entity", to);
                myDiagram.model.setDataProperty(link, "Destiny Port", "*");
                myDiagram.model.setDataProperty(link, "NAT", true);
                myDiagram.model.setDataProperty(link, "Traffic IDs", "");
                myDiagram.commitTransaction("Set Link Attrs");
                break;
            default:
        }
    });

    myDiagram.addModelChangedListener(function(evt) {
        // ignore unimportant Transaction events
        if (!evt.isTransactionFinished) return;
        var txn = evt.object;  // a Transaction
        if (txn === null) return;

        json = myDiagram.model.toJson();
        document.getElementById("JsonModel").value = json;

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