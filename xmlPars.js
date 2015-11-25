var xmlFile;

window.onload = function ()
{
    document.getElementById("NewType").value = 0;
    document.getElementById("NewValue").value = "0";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "Input.xml", false);
    xmlhttp.send();
    xmlFile = xmlhttp.responseXML;
    if (xmlFile)
    {
        xmlParser(xmlFile);
    }
}

function printParam( element )
{
    var html_element = document.createElement("p");
    html_element.setAttribute("class", "Parameter");
    html_element.setAttribute("id", element.id);
    html_element.setAttribute("Name", element.name);
    html_element.setAttribute("Description", element.description);
    html_element.setAttribute("type", element.type);
    html_element.setAttribute("value", element.value);
    document.getElementById("Content").appendChild(html_element);
    var form_type = getFormValue(element.type, element.value);
    var string_to_show = "<a id=\"DeleteButton\" onclick=\'deleteParam(this.parentNode)\'/>Delete</a>";
    string_to_show += "     Id: ".bold() + element.id + "; Name: ".bold() + element.name
                            + "; Description: ".bold() + element.description + form_type + "</br>";
    html_element.innerHTML = string_to_show;
}
function getFormValue( type, value )
{
    var string_to_return = "; Type: ".bold() + type + "; Value: ".bold();
    switch (type)
    {
        case 'String':
            if (value === "")
                return string_to_return + "<input oninput=\'setElementValue(this, this.parentNode, false)\' type=\'text\' />";
            return string_to_return + "<input oninput=\'setElementValue(this, this.parentNode, false)\' type=\'text\' value=\'" + value + "\' />";
        case 'Int32':
            return string_to_return + 
			"<input onkeyup=\'checkData(element.value)\' oninput=\'setElementValue(this, this.parentNode, true)\' type=\'text\' value=" + value + " />";
        case 'Boolean':
            var checkbox = "";
            if (value === "True" )
                checkbox = "checked";
            return string_to_return + "<input oninput=\'setElementValue(this, this.parentNode, false)\' type=\'checkbox\'" + checkbox + "/>";
    }
}

function xmlParser( xml_doc )
{
    var params = xml_doc.getElementsByTagName("Parameter");
    for (var i = 0; i < params.length; i++)
    {
        var element = new Object();
        element.id = params[i].getElementsByTagName("Id")[0].firstChild.nodeValue;
        element.name = params[i].getElementsByTagName("Name")[0].firstChild.nodeValue;
        element.description = params[i].getElementsByTagName("Description")[0].firstChild.nodeValue;
        element.type = params[i].getElementsByTagName("Type")[0].firstChild.nodeValue;
        element.type = element.type.replace('System.', '');
        element.value = params[i].getElementsByTagName("Value")[0].firstChild.nodeValue;
        printParam(element);
    }
}
function saveParam()
{
    var form = document.getElementById("NewParameter")
    var element = new Object();
    element.id = document.getElementById("NewId").value;
    element.name = document.getElementById("NewName").value;
    element.description = document.getElementById("NewDescription").value;
    element.type = getTypeFromCombobox();
    element.value = getNewValue(element.type);
    if (checkData(element))
    return;
    printParam(element);
    cancelParam();
}
function setElementValue(child_node, parent_node, isNumber)
{
    if (parent_node.getAttribute("type") == "Boolean")
    {
        if( child_node.checked )
            parent_node.setAttribute('value', "True");
        else
            parent_node.setAttribute('value', "False");
    }
    else
    {
        if( isNumber == true)
        {
            if (!(/(^([+-]?)([1-9]+?)[0-9]*$)|^0$/.test(child_node.value))) {
                if (!(child_node.value == "") && !(child_node.value == "-") && !(child_node.value == "0"))
                    child_node.value = parent_node.getAttribute('value');
            }
            else
            {
                if ((/\d+-\d/).test(child_node.value))
                {
                    child_node.value = parent_node.getAttribute('value');
                }
                if ((/--/).test(child_node.value))
                  {
                    child_node.value = child_node.value.replace("--", "-");
                  }
            }
			var max = 2147483647;
			var min = -2147483648;
			if (child_node.value > max) child_node.value = parent_node.getAttribute('value');
			if (child_node.value < min) child_node.value = parent_node.getAttribute('value');
        }
        parent_node.setAttribute('value', child_node.value);
    }
}

function deleteParam( child_node )
{
    child_node.parentNode.removeChild(child_node);
}

function addParam()
{
    document.getElementById("NewParameter").hidden = false;
    document.getElementById("AddButton").hidden = "hidden";
    document.getElementById("DownloadButton").hidden = "hidden";
}

function cancelParam()
{
    document.getElementById("NewParameter").hidden = "hidden";
    document.getElementById("AddButton").hidden = false;
    document.getElementById("DownloadButton").hidden = false;
}

function checkData(element)
{
    var result = false;
    if (element.id == "")
    {
        result = true;
    }
    if (element.name == "")
    {
        result = true;
    }
    if (element.description == "")
    {
        result = true;
    }
    if (element.name == "Int32")
    {	
		if (/^0/.test(element.value))
		{ 	
			document.getElementById("NewDescription").value = "0";
            result = true;
		} 
		else
			if (!(/(^([+-]?)([1-9]+?)[0-9]*$)|^0$/.test(element.value)))
			{
				if (!child_node.value == "")
					child_node.value = parent_node.getAttribute('value');
				result = true;
			}
    }
    return result;
}
function changeType()
{
    var current_type = document.getElementById("NewType").value;
    if (current_type == "2")
    {
        document.getElementById("NewValue").setAttribute("type", "text");
        document.getElementById("NewValue").value = "Add string";
        return;
    }
    if (current_type == "0") {
        document.getElementById("NewValue").setAttribute("type", "number");
        document.getElementById("NewValue").value = "0";
        return;
    }
    else
    {
        document.getElementById("NewValue").setAttribute("type", "checkbox");
        document.getElementById("NewValue").value = "";
    }
}

function getTypeFromCombobox()
{
    var current_type = document.getElementById("NewType").value;
    switch (current_type)
    {
        case "0":
            return "Int32";
        case "1":
            return "Boolean";
        case "2":
            return "String";
    }
}

function getNewValue( type ) {
    switch (type) {
        case "String":
        case "Int32":
        {
			return document.getElementById("NewValue").value;
        }
        case "Boolean":
        {
            if (document.getElementById("NewValue").checked)
            {
                return "True";
            }
            else
            {
                return "False";
            }
        }
    }
}

function generateOutputFile()
{
    var content = document.getElementById("Content").getElementsByTagName("p");
    var xmlStr = "<?xml version=\"1.0\"?>\n";
    xmlStr += "<Parameters>\n";
    for (var i = 0; i < content.length; i++)
    {
        type = content[i].getAttribute("type");
        xmlStr += "<Parameter>\n";
        xmlStr += "<Id>" + content[i].getAttribute("id") + "</Id>\n";
        xmlStr += "<Name>" + content[i].getAttribute("name") + "</Name>\n";
        xmlStr += "<Description>" + content[i].getAttribute("description") + "</Description>\n";
        xmlStr += "<Type>System." + type;
        xmlStr += "</Type>\n";
        xmlStr += "<Value>" + content[i].getAttribute("value") + "</Value>\n";
        xmlStr += "</Parameter>";
    }
    xmlStr += "</Parameters>";
    return xmlStr;
}

function downloadThis(fileName, type)
{

    var text = generateOutputFile();
    var file = new Blob([text], { type: type });
    var linkToFile = document.getElementById("linkToFile");
    linkToFile.href = URL.createObjectURL(file);
    linkToFile.download = fileName;
    document.getElementById('linkToFile').click();
}

