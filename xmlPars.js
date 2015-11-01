var file_xml;

window.onload = function ()
{
    document.getElementById("NewType").value = 0;
    document.getElementById("NewValue").value = "Add value";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "Input.xml", false);
    xmlhttp.send();
    file_xml = xmlhttp.responseXML;
    if (file_xml)
    {
        xmlParser(file_xml);
    }
}

function printParam(element)
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
    var print_string = "     ID: ".bold() + element.id + "; Name: ".bold() + element.name
                            + "; Description: ".bold() + element.description + form_type;
	print_string += " <li class=\"menu\"><a id=\"DeleteButton\" onclick=\'deleteParam(this.parentNode)\'/>Delete</a></li></br>";						
    html_element.innerHTML = print_string;
}
function xmlParser(file_xml)
{
    var params = file_xml.getElementsByTagName("Parameter");
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
            if (!(/-?[1-9][0-9]*$/.test(child_node.value)))
            {
                child_node.value = "";
            }

        }
        parent_node.setAttribute('value', child_node.value);
    }
}

function deleteParam( child_node )
{
    child_node.parentNode.removeChild(child_node);
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
        if (!(/-?[1-9][0-9]*$/.test(element.value)))
        {
            document.getElementById("NewDescription").value = "";
            result = true;
        }
    }
    return result;
}
function addParam()
{
    document.getElementById("NewParameter").hidden = false;
    document.getElementById("AddButton").hidden = "hidden";
    document.getElementById("DownloadButton").hidden = "hidden";
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
function getFormValue(type, value)
{
    var string_to_return = "; Type: ".bold() + type + "; Value: ".bold();
    switch (type)
    {
        case 'Int32':
            return string_to_return + "<input oninput=\'setElementValue(this, this.parentNode, true)\' type=\'text\' value=" + value + " />";
        case 'Boolean':
            var checkbox = "";
            if (value === "True" )
                checkbox = "checked";
            return string_to_return + "<input oninput=\'setElementValue(this, this.parentNode, false)\' type=\'checkbox\'" + checkbox + "/>";
		case 'String':
            if (value === "")
                return string_to_return + "<input oninput=\'setElementValue(this, this.parentNode, false)\' type=\'text\' />";
            return string_to_return + "<input oninput=\'setElementValue(this, this.parentNode, false)\' type=\'text\' value=\'" + value + "\' />";
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

function changeType()
{
    var current_type = document.getElementById("NewType").value;
    if (current_type == "0")
    {
        document.getElementById("NewValue").setAttribute("type", "number");
        document.getElementById("NewValue").value = 0;
        return;
    }
    if (current_type == "1") 
    {
        document.getElementById("NewValue").setAttribute("type", "checkbox");
        document.getElementById("NewValue").value = "";
    }
    else
    {
        document.getElementById("NewValue").setAttribute("type", "text");
        document.getElementById("NewValue").value = "Add value";
        return;
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