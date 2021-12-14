var animation = new go.Animation();
animation.easing = go.Animation.EaseOutQuad;
animation.duration = 1500;
animation.runCount = Infinity;
animar = [];

function filter() {
    pararAnimacao();

    resetFilterCheckboxes();

    animar=[];
    animation = new go.Animation();
    animation.easing = go.Animation.EaseOutQuad;
    animation.duration = 1500;
    animation.runCount = Infinity;

    ip = getIpFiltro();
    port = getPortFiltro();
    name_entity = getNameFiltro();

    var array_filtro_ip = [];
    var array_filtro_nome = [];
    var array_filtro_porta = [];
    var array_final = [];

    //busca apenas por ip
    if(ip!="any" && port == "any"){
        array_filtro_ip =  filtraPorIP(ip);
        array_final = array_filtro_ip;
    }
    else if(name_entity!="any" && port =="any"){ //busca apenas por nome
        array_filtro_nome = filtraPorNome(name_entity);
        array_final = array_filtro_nome;
    }

    //busca apenas por porta
    if(ip=="any" && port!="any"){
        array_filtro_porta = filtraPorPorta(port);
        array_final = array_filtro_porta;
    }
        
    if(ip!="any" && name_entity!="any" && port!="any"){ //apenas IP e porta
        array_filtro_ip =  filtraPorIP(ip);
        array_filtro_porta = filtraPorPorta(port);

        array_ip_porta = array_filtro_ip.filter(value => array_filtro_porta.includes(value));
        if(array_ip_porta.length == 0) {
            alert("There are not traffics with those parameters.");
            return;
        }
        array_final=array_ip_porta;

        animation = new go.Animation();
        animation.easing = go.Animation.EaseOutQuad;
        animation.duration = 1500;
        animation.runCount = Infinity;
        for(i=0;i<array_ip_porta.length;i++){
            inserirAnimacao(array_ip_porta[i]);    
        }
    }

    if(ip=="any" && name_entity!="any" && port!="any"){ //apenas nome e porta
        array_filtro_nome =  filtraPorNome(name_entity);
        array_filtro_porta = filtraPorPorta(port);

        array_name_porta = array_filtro_nome.filter(value => array_filtro_porta.includes(value));
        if(array_name_porta.length == 0) {
            alert("There are not traffics with those parameters.");
            return;
        }
        array_final=array_name_porta;

        animation = new go.Animation();
        animation.easing = go.Animation.EaseOutQuad;
        animation.duration = 1500;
        animation.runCount = Infinity;
        for(i=0;i<array_name_porta.length;i++){
            inserirAnimacao(array_name_porta[i]);    
        }
    }

    if(animar.length == 0) alert("There are not traffics with those parameters.")


    if(document.getElementById('hideTrafficsFilter').checked)
        hideOtherTraffics(array_final);

    if(document.getElementById('hideNodesFilter').checked)
        hideOtherNodes(array_final);

    animation.start();
}

function filtraPorNome(nome){
    var nodes = [];
    
    myDiagram.nodes.each(function (node) {
        if (node.data.text.toLowerCase().includes(nome.toLowerCase()) && node.data.category != "Firewall") {
            nodes.push(node);
        }
    });
    if(nodes.length==0){
        window.alert("There are no nodes with that Name");
        return;
    }

    links_animar =[];
    for(i=0;i<nodes.length;i++){
        inserirAnimacaoNode(nodes[i]);   
        links_animar = links_animar.concat(fazFiltro(nodes[i]));
    }
    return links_animar;
}

function filtraPorIP(ip) {
    
    var no_ip;
    nodes = [];

    myDiagram.nodes.each(function (node) {
        if (node.data.IP == ip || node.data.Prefix == ip) {
            no_ip = node;
        }
    });
    if (no_ip == "") {
        window.alert("There are no nodes with that IP");
        return;
    }

    nodes.push(no_ip);

    //verificar se node_ip é um host, se sim, verificar se faz parte de um host list
    if(no_ip.category=="Host"){
        is_in_hostlist = false;
        hostlists = myDiagram.findNodesByExample({category: "Hosts"});
        it = hostlists.iterator;
        while(it.next()){
            hosts_inside = it.value.data.Hosts;
            if(hosts_inside.includes(no_ip.data.text)){
                nodes.push(it.value)
            }
        }
    }
 
    links_animar =[];
    for(i=0;i<nodes.length;i++){
        inserirAnimacaoNode(nodes[i]);   
        links_animar = links_animar.concat(fazFiltro(nodes[i]));
    }
    return links_animar;
}

function fazFiltro(no_ip){
    var array_ip=[];
    links_conectados = [];
    links_conectados = no_ip.findLinksConnected();    
    var ot = links_conectados.iterator;
    while(ot.next()){
        
        array_ip.push(ot.value);
        inserirAnimacao(ot.value);

        //se for o filtro for ip de interface
        if (no_ip.category == "Interface") {
            array_ip = array_ip.concat(filtraPorIPInterface(ot.value));
        }
        //se for o filtro for ip de entidade
        if (no_ip.category != "Interface") {
            array_ip = array_ip.concat(filtraPorIpEntidades(ot.value))
        }        
    }    
    return array_ip;
}
     

    

function filtraPorIPInterface(link) {
    array1 = [];
    if (link.category == "TrafegoEntrada" || link.category == "TrafegoRedirecionamento") {
        links_saida = myDiagram.findLinksByExample({category: "TrafegoSaida"});
        it = links_saida.iterator;
        while (it.next()) {
            if (it.value.data["ID_in"].toString().includes(link.data["ID"])) {
                inserirAnimacao(it.value);
                array1.push(it.value);
            }
        }
        links_traducao = myDiagram.findLinksByExample({category: "TrafegoTraducao"});
        it = links_traducao.iterator;
        while (it.next()) {
            if (it.value.data["ID_in"].toString().includes(link.data["ID"])) {
                inserirAnimacao(it.value);
                array1.push(it.value);
            }
        }
    }
    if (link.category == "TrafegoSaida" || link.category == "TrafegoTraducao") {
        links_entrada = myDiagram.findLinksByExample({category: "TrafegoEntrada"});
        it = links_entrada.iterator;
        while (it.next()) {
            if (link.data["ID_in"].toString().includes(it.value.data["ID"])) {
                inserirAnimacao(it.value);
                array1.push(it.value);
            }
        }
        links_redirecionamento = myDiagram.findLinksByExample({category: "TrafegoRedirecionamento"});
        it = links_redirecionamento.iterator;
        while (it.next()) {
            if (link.data["ID_in"].toString().includes(it.value.data["ID"])) {
                inserirAnimacao(it.value);
                array1.push(it.value);
            }
        }
    }

    return array1;
}

function filtraPorIpEntidades(link) {
    array2 = [];
    if (link.category == "TrafegoEntrada" || link.category == "TrafegoRedirecionamento") {
        links_saida = myDiagram.findLinksByExample({category: "TrafegoSaida"});
        it = links_saida.iterator;
        while (it.next()) {
            if (it.value.data["ID_in"].toString().includes(link.data["ID"])) {
                inserirAnimacao(it.value);
                array2.push(it.value);
            }
        }
        links_traducao = myDiagram.findLinksByExample({category: "TrafegoTraducao"});
        it = links_traducao.iterator;
        while (it.next()) {
            if (it.value.data["ID_in"].toString().includes(link.data["ID"])) {
                inserirAnimacao(it.value);
                array2.push(it.value);
            }
        }
    }
    if (link.category == "TrafegoSaida" || link.category == "TrafegoTraducao") {
        links_entrada = myDiagram.findLinksByExample({category: "TrafegoEntrada"});
        it = links_entrada.iterator;
        while (it.next()) {
            if (link.data["ID_in"].toString().includes(it.value.data["ID"])) {
                inserirAnimacao(it.value);
                array2.push(it.value);
            }
        }
        links_redirecionamento = myDiagram.findLinksByExample({category: "TrafegoRedirecionamento"});
        it = links_redirecionamento.iterator;
        while (it.next()) {
            if (link.data["ID_in"].toString().includes(it.value.data["ID"])) {
                inserirAnimacao(it.value);
                array2.push(it.value);
            }
        }
    }
    return array2;
}


function filtraPorPorta(port){
    array_porta=[];
    links_entrada_porta=[];
    links_source_port = myDiagram.findLinksByExample({category: "TrafegoEntrada"});
    it = links_source_port.iterator;
    while (it.next()) {
        if (it.value.data["Source Port"] == port){
            inserirAnimacao(it.value);
            array_porta.push(it.value);
            links_entrada_porta.push(it.value.data)
        }
    }
    
    links_source_port=null;
    links_source_port = myDiagram.findLinksByExample({category: "TrafegoRedirecionamento"});
    it = links_source_port.iterator;
    while (it.next()) {
        if (it.value.data["Source Port"] == port || it.value.data["Redirect Port"] == port){
            inserirAnimacao(it.value);
            array_porta.push(it.value);
            links_entrada_porta.push(it.value.data)
        }
    }

    links_saida_porta = []
    links_destiny_port = myDiagram.findLinksByExample({category: "TrafegoSaida"});
    it = links_destiny_port.iterator;
    while (it.next()) {
        if (it.value.data["Destiny Port"] == port){
            inserirAnimacao(it.value);
            array_porta.push(it.value);
            links_saida_porta.push(it.value.data)
        }
    }
    links_destiny_port = myDiagram.findLinksByExample({category: "TrafegoTraducao"});
    it = links_destiny_port.iterator;
    while (it.next()) {
        if (it.value.data["Destiny Port"] == port){
            inserirAnimacao(it.value);
            array_porta.push(it.value);
            links_saida_porta.push(it.value.data)
        }
    }

    if(links_entrada_porta.length>0){
        for(i=0;i<links_entrada_porta.length;i++) {
            links_saida = myDiagram.findLinksByExample({category: "TrafegoSaida"});
            it = links_saida.iterator;
            while (it.next()) {
                if (it.value.data["ID_in"].includes(links_entrada_porta[i]["ID"].toString())) {
                    inserirAnimacao(it.value);
                    array_porta.push(it.value);
                }
            }
            links_traducao = myDiagram.findLinksByExample({category: "TrafegoTraducao"});
            it = links_traducao.iterator;
            while (it.next()) {
                if (it.value.data["ID_in"].includes(links_entrada_porta[i]["ID"].toString())) {
                    inserirAnimacao(it.value);
                    array_porta.push(it.value);
                }
            }
        }
    }
    
    if(links_saida_porta.length>0){
        for(i=0;i<links_saida_porta.length;i++) {
            links_entrada = myDiagram.findLinksByExample({category: "TrafegoEntrada"});
            it = links_entrada.iterator;
            while (it.next()) {
                if (links_saida_porta[i]["ID_in"].toString().includes(it.value.data["ID"])) {
                    inserirAnimacao(it.value);
                    array_porta.push(it.value);
                }
            }
            links_redirecionamento = myDiagram.findLinksByExample({category: "TrafegoRedirecionamento"});
            it = links_redirecionamento.iterator;
            while (it.next()) {
                if (links_saida_porta[i]["ID_in"].toString().includes(it.value.data["ID"])) {
                    inserirAnimacao(it.value);
                    array_porta.push(it.value);
                }
            }
        }
    
    }

    return array_porta;
    
}

function hideOtherTraffics(array){
    traffics_hide = myDiagram.links;
    it = traffics_hide.iterator;
    while(it.next()){
        if(!array.includes(it.value)){
            myDiagram.startTransaction("Change traffic visible");
            myDiagram.model.setDataProperty(it.value.data, "opacity", 0.0);
            myDiagram.commitTransaction("Change traffic visible");
        }        
    }
}

function hideOtherNodes(array){
    all_nodes = myDiagram.nodes;
    it=all_nodes.iterator;
    while(it.next()){
        if(!isLinkConnectedToNode(array, it)){
            myDiagram.startTransaction("Change node visible");
            myDiagram.model.setDataProperty(it.value.data, "opacity", 0.0);
            myDiagram.commitTransaction("Change node visible");
        }
    }
}

function isLinkConnectedToNode(array, it){
    var links_connected = [];
    links_connected = it.value.findLinksConnected();
    iter = links_connected.iterator;
    while(iter.next()){
        if(array.includes(iter.value)) return true;
    }
    return false;

}


function getIpFiltro() {
    if (
        document.getElementById("ipFiltroAny").checked ||
        document.getElementById("ipFiltro").value == ""
    )
        return "any";
    return document.getElementById("ipFiltro").value;
}

function getPortFiltro() {
    if (
        document.getElementById("portFiltroAny").checked ||
        document.getElementById("portFiltro").value == ""
    )
        return "any";
    return document.getElementById("portFiltro").value;
}

function getNameFiltro() {
    if (
        document.getElementById("nameFiltroAny").checked ||
        document.getElementById("nameFiltro").value == ""
    )
        return "any";
    return document.getElementById("nameFiltro").value;
}

function inserirAnimacao(link) {
    animation.add(link.findObject("PIPE"), "opacity", 0, 1);
    animation.add(link.findObject("PIPE"), "strokeWidth", 10, 2);
    animation.add(link.findObject("PIPE"), "strokeDashOffset", 20, 0);
    animar.push(link);
}

function inserirAnimacaoNode(node){
    animation.add(node.findObject("SHAPE"), "opacity", 0, 1);
    //animation.add(node.findObject("SHAPE"), "strokeWidth", 10, 2);
    animation.add(node.findObject("SHAPE"), "strokeDashOffset", 20, 0);
    animar.push(node);
}

function pararAnimacao() {
    animation.stop();
    traffics_show = myDiagram.links;
    it1 = traffics_show.iterator;
    while(it1.next()){
        myDiagram.startTransaction("Change traffic visible");
        myDiagram.model.setDataProperty(it1.value.data, "opacity", 1);
        myDiagram.commitTransaction("Change traffic visible");
    }

    all_nodes = myDiagram.nodes;
    it2 = all_nodes.iterator;
    while(it2.next()){
            myDiagram.startTransaction("Change node visible");
            myDiagram.model.setDataProperty(it2.value.data, "opacity", 1);
            myDiagram.commitTransaction("Change node visible");
    }
}

function resetFilterCheckboxes(){
    document.getElementById("showincoming").checked = true;
    document.getElementById("showredirect").checked = true;
    document.getElementById("showblock").checked = true;
    document.getElementById("showoutgoing").checked = true;
    document.getElementById("shownat").checked = true;
    document.getElementById("showUnconnectedNodes").checked = true;
}