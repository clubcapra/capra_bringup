//launchmanager.js

// this code uses !! (not not) for truth boolean conversion
// See this link for more infos:
// http://www.bennadel.com/blog/1784-using-double-not-operator-for-boolean-type-casting.htm

jQuery(function($) {

    var launchfile_select,
        launchfile_code,
        launchfile_editBtn,
        launchfile_cancelBtn,
        launchfile_form,
        launchfile_formDiv,
        launchfile_name;

    $(document).ready(function () {
        init();
    });

    function appendSelectElementName(element, enabled, selectValue)
    {
        select =
            $('<select class="form-control" >' +
                '<option>arg</option>' +
                '<option>include</option>' +
                '<option>node</option>' +
                '<option>param</option>' +
            '</select>');


        if(enabled)
        {
            select.change(function(e){
                element.after(createElementForm($(this).val(), enabled));
                element.remove();
            });
        }
        else
        {
            select.attr('disabled', !enabled);
        }

        if(!!selectValue)
            select.val(selectValue);

        element.append(select);
    }

    function appendArgAttributes(element, obj)
    {
        var innerDiv = $('<div>');

        inputName = $('<input type="text" name="arg[name]" class="form-control" />')
        inputDefault = $('<input type="text" name="arg[default]" class="form-control" />')
        inputValue = $('<input type="text" name="arg[value]" class="form-control" />')

        innerDiv.append($('<label>name:</label>')).append(inputName);
        innerDiv.append($('<br/><label>default:</label>')).append(inputDefault);
        innerDiv.append($('<br/><label>value:</label>')).append(inputValue);

        if(!!obj) {
            if (!!obj.name)
                inputName.val(obj.name);

            if (!!obj.default)
                inputDefault.val(obj.default);

            if (!!obj.value)
                inputValue.val(obj.value);
        }

        element.append(innerDiv);
    }

    function appendIncludeAttributes(element, obj)
    {
        var innerDiv = $('<div>');

        inputFile = $('<input type="text" name="include[file]" class="form-control" />');

        innerDiv.append($('<label>file:</label>')).append(inputFile);

        if(!!obj) {
            if (!!obj.file)
                inputFile.val(obj.file);

            //append arg sub node to include nodes
            if (!!obj.arg)
            {
                if (obj.arg instanceof Array)
                {
                    for(var i = 0; i < obj.arg.length; ++i)
                    {
                        appendSelectElementName(innerDiv, false, 'arg');
                        appendArgAttributes(innerDiv, obj.arg[i]);
                    }
                }
                else
                {
                    appendSelectElementName(innerDiv, false, 'arg');
                    appendArgAttributes(innerDiv, obj.arg);
                }
            }
        }

        element.append(innerDiv);
    }

    function appendNodeAttributes(element, obj)
    {
        var innerDiv = $('<div>');

        inputArgs = $('<input type="text" name="node[args]" class="form-control" />');
        inputName = $('<input type="text" name="node[name]" class="form-control" />');
        inputOutput = $('<input type="text" name="node[output]" class="form-control" />');
        inputPkg = $('<input type="text" name="node[pkg]" class="form-control" />');
        inputType = $('<input type="text" name="node[type]" class="form-control" />');

        innerDiv.append($('<label>args:</label>')).append(inputArgs);
        innerDiv.append($('<br/><label>name:</label>')).append(inputName);
        innerDiv.append($('<br/><label>output:</label>')).append(inputOutput);
        innerDiv.append($('<br/><label>pkg:</label>')).append(inputPkg);
        innerDiv.append($('<br/><label>type:</label>')).append(inputType);

        if(!!obj) {
            if (!!obj.name)
                inputName.val(obj.name);

            if (!!obj.pkg)
                inputPkg.val(obj.pkg);

            if (!!obj.type)
                inputType.val(obj.type);

            if (!!obj.args)
                inputArgs.val(obj.args);

            if (!!obj.output)
                inputOutput.val(obj.output);

            //append param sub node to node nodes
            if (!!obj.param)
            {
                if (obj.param instanceof Array)
                {
                    for(var i = 0; i < obj.param.length; ++i)
                    {
                        appendSelectElementName(innerDiv, false, 'param');
                        appendParamAttributes(innerDiv, obj.param[i]);
                    }
                }
                else
                {
                    appendSelectElementName(innerDiv, false, 'param');
                    appendParamAttributes(innerDiv, obj.param);
                }
            }
        }

        element.append(innerDiv);
    }

    function appendParamAttributes(element, obj)
    {
        var innerDiv = $('<div>');

        inputName = $('<input type="text" name="param[name]" class="form-control" />');
        inputValue = $('<input type="text" name="param[value]" class="form-control" />');

        innerDiv.append($('<label>name:</label>')).append(inputName);
        innerDiv.append($('<br/><label>value:</label>')).append(inputValue);

        if(!!obj) {
            if (!!obj.name)
                inputName.val(obj.name);

            if (!!obj.value)
                inputValue.val(obj.value);
        }

        element.append(innerDiv);
    }

    //type selectable, can we change the type of the current node which change attributes.
    //Example: include type is selected, can we change from include to another type (arg, node, param ...)
    function createElementForm(elementName, typeSelectable,  data)
    {
        div = $('<div class="form-group">')
        appendSelectElementName(div, typeSelectable, elementName);

        if(elementName == 'node')
            appendNodeAttributes(div, data);
        else if(elementName == 'include')
            appendIncludeAttributes(div, data);
        else if(elementName == 'arg')
            appendArgAttributes(div, data);
        else if(elementName == 'param')
            appendParamAttributes(div, data);

        return div;
    }

    function formatLaunchFileCode(data)
    {
        //add "name" class to XML elements' names.
        data = data.replace(/&lt;(\/?)([A-Za-z]+)(.*)(\/?)&gt;/g, '&lt;$1<span class="name">$2</span>$3$4&gt;');

        //add "attribute" class to XML elements' attributes except "class" which would conflict with html class keyword.
        data = data.replace(/( (?!class=)[a-zA-Z]+)=/g, '<span class="attribute">$1</span>=');

        return data;
    }

    function formatLaunchFileXMLtoHtmlForm(xml, form)
    {
        form.empty();
        //convert xml to json
        json = $.xml2json(xml);

        for(var element in json)
        {
            if(json[element] instanceof Array) //we have more than one element of a same kind. Example: 3 includes
            {
                for(var i = 0; i < json[element].length; ++i)
                {
                    form.append(createElementForm(element, false, json[element][i]));
                }
            }
            else //we only have one element of a kind
            {
                form.append(createElementForm(element, false,  json[element]));
            }
        }
    }

    function getLaunchFile(launchFile)
    {
         $.ajax({
                url: "/launchfiles/" + launchFile,
                type: 'GET',
                dataType: 'json'
            })
                .done(function (data) {
                    if(data.success)
                    {
                        launchfile_name.val(launchFile);
                        launchfile_code.html(formatLaunchFileCode(data.content));
                        formatLaunchFileXMLtoHtmlForm(data.xml, launchfile_formDiv);
                    }
                    else
                        alert("Le fichier est introuvable.")
                })
                .fail(function () {
                    alert("Une erreur est survenue.")
                });
    }

    function init()
    {
        initVariables(); //must be done first
        initEventHandlers();

        //select first launch file.
        launchfile_select[0].selectedIndex = 0;
        //trigger event to get launch file code.
        launchfile_select.change();

        switchToView();
    }

    function initVariables()
    {
        launchfile_select = $("#launchfile_select");
        launchfile_code = $(".launchfile_code");
        launchfile_editBtn = $("#launchfile_edit");
        launchfile_cancelBtn = $("#launchfile_cancel");
        launchfile_form = $("#launchfile_form");
        launchfile_formDiv = $("#launchfile_formdiv");
        launchfile_name = $("input[name=launchfile_name]");
    }

    function initEventHandlers()
    {
        launchfile_select.change(function (e) {
            var selectedValue = this.value;
            getLaunchFile(selectedValue);
        });

        launchfile_cancelBtn.click(function(e){
            switchToView();
        });

        launchfile_editBtn.click(function(e){
            switchToEdit();
        });
    }

    function switchToView(){
        launchfile_cancelBtn.hide();
        launchfile_editBtn.show();
        launchfile_code.show();
        launchfile_form.hide();
    }

    function switchToEdit(){
        launchfile_cancelBtn.show();
        launchfile_editBtn.hide();
        launchfile_code.hide();
        launchfile_form.show();
    }

});