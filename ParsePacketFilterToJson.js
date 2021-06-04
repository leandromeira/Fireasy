var key = -2

function parsePacketFilterToJson(lines){

    var json = generic_json_header_firewall;

    var default_policy = getDefaultPolicyPF(lines);
    if(default_policy == null){
        alert("There is no default policy defined for firewall");
        return "";
    }     
    json = json.concat(default_policy);

    var interfaces = getInterfacesPF(lines);
    if(interfaces == null){
        alert("There is no interface defined for firewall");
        return "";
    } 
    json = json.concat(interfaces);

    var unknown_networks = getUnknownNetworksPF(lines);
    json = json.concat(unknown_networks);

    var host = getHostPF(lines);
    json = json.concat(host);

    json = json.concat(generic_json_link_array_header);

    //links

    json = json.concat(generic_json_closing_chars);
    return json;
}



function insertColors(){
    return ", \"Fill Color\":\"#282c34\", \"Stroke Color\":\"#00A9C9\", \"Text Color\":\"white\"}";
}

function getDefaultPolicyPF(lines){
    var policy="";
    for(var i=0; i<lines.length;i++){
        if(lines[i].includes("all")){
            var policy = lines[i].split(" ")[0].toLowerCase();
            lines = lines.splice(i,1);
            break;
        }
    }
    if(policy == "") {
        return null;
    }
    var dpolicy = "\"Default Policy\":\""+policy+"\"}";
    return dpolicy;
}

function getInterfacesPF(lines){
    var ints = [];
    for(var i=0; i<lines.length;i++){
        line = lines[i].split(" ")[3];
        if(!ints.includes(line)){
            ints.push(line);
        }
    }
    if(ints == []){ 
        //nao há interfaces, ou seja, não existe nenhuma regra
        return null;
    }
    var interfaces = [];
    for(var i=0; i<ints.length;i++){
        int = ",\n{\"category\":\"Interface\", \"group\":-1, \"Firewall Name\":\"Firewall\", "+"\"key\":"+key+", \"text\":\""+ints[i]+"\", \"Device Name\":\""+ints[i]+
            "\", \"IP\":\"\", \"Netmask\":\"\"";
        int = int.concat(insertColors());
        interfaces.push(int);
        key--;
    }    
    return interfaces.join("");
}

function getUnknownNetworksPF(lines){
    for(var i=0; i<lines.length;i++){
        if(lines[i].includes("any")){
            var unknown = ",\n{\"category\":\"Internet\", \"text\":\"Internet\", \"key\":"+key;
            unknown = unknown.concat(insertColors());
            key--;
            return unknown;
        }
    }
}

function getHostPF(lines){
    var ips = [];
    for(var i=0; i<lines.length; i++){
        from = lines[i].split("from")[1];
        //console.log(from)
        if(from.includes("{")){
            var brackets = [];
            from = from.split("{");
            //console.log(from)
            for(var j=0; j<from.length; j++){
                if(from[j] == " ") continue;
                list = from[j].split("}")[0];
                list = list.replace(/\s/g, '');
                brackets.push(list);
                
                //brackets.push(from[j].split("}"));
            }
            console.log(brackets)
            //console.log(from)
        } 
        //console.log(lines[i].split("from")[1].split(" ")[1]);
        
    }
}

function isHosts(ips){

}
