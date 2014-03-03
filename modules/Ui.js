/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, Mustache */

/*
    Ui.js
    Manages the UI
 */

define(function (require, exports, module) {
    'use strict';

    var CommandManager    = brackets.getModule("command/CommandManager"),
        Menus             = brackets.getModule("command/Menus"),
        PanelManager      = brackets.getModule("view/PanelManager"),
        _                 = brackets.getModule("thirdparty/lodash"),

        Strings           = require("../strings"),
        COMMAND_ID        = "brackets-cardboard.cardboardShowPanel",
        $icon             = $( "<a href='#' title='" + Strings.EXTENSION_NAME + "' class='brackets-cardboard-icon'></a>" ),
        panel             = null;
    

    /**
     * Show the cardboard panel
     */
    function cardboardShowPanel() {
        console.log("Executing Command cardboardShowPanel");
        if(panel.isVisible()) {
            panel.hide();
            $icon.removeClass("active");
            CommandManager.get(COMMAND_ID).setChecked(false);
        }
        else {
            panel.show();
            $icon.addClass("active");
            CommandManager.get(COMMAND_ID).setChecked(true);
        }
    }

    // View menu
    // TODO remove?
    CommandManager.register(Strings.MENU_NAME, COMMAND_ID, cardboardShowPanel);
    var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
    menu.addMenuItem(COMMAND_ID);

    // Listener for toolbar icon
    $icon.click(function () {
        CommandManager.execute(COMMAND_ID);
    }).appendTo("#main-toolbar .buttons");
    

    function listManagers(data, selector) {
        var template = require("text!../html/managers.html"),
            templateData = _.merge(data, Strings),
            templateHtml = Mustache.render(template, templateData);

        $(selector).html(templateHtml);
    }

    function updateResults(data, selector) {
        var template = require("text!../html/results.html"),
            templateData = _.merge(data, Strings),
            templateHtml = Mustache.render(template, templateData);

        $(selector).html(templateHtml);

    }

    function addPanel(data) {
        var template = require("text!../html/panel.html");
        var panelHtml = Mustache.render(template, data);

        panel = PanelManager.createBottomPanel(COMMAND_ID, $(panelHtml), 200);
        
        
        // Listeners for panel
        var $cardboardPanel = $("#brackets-cardboard");
        
        $cardboardPanel
            .on( 'click', '.close', function () {
                console.log('close');
                panel.hide();
                $icon.removeClass("active");
                CommandManager.get(COMMAND_ID).setChecked(false);
            });
    }

    addPanel(Strings);


    exports.listManagers = listManagers;
    exports.updateResults = updateResults;
    exports.cardboardShowPanel = cardboardShowPanel;
});
