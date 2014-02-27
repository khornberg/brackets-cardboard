/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, Mustache */

/*
    ui.js
    Managers the UI
 */

define(function (require, exports, module) {
    'use strict';

    var CommandManager    = brackets.getModule("command/CommandManager"),
        Menus             = brackets.getModule("command/Menus"),
        PanelManager      = brackets.getModule("view/PanelManager"),

        Strings           = require("../strings"),
        COMMAND_ID        = "backets-pdm.pdmShowPanel",
        $icon             = $( "<a href='#' title='" + Strings.EXTENSION_NAME + "' id='brackets-pdm-icon'></a>" ),
        panel             = null;

    /**
     * Show the pdm panel
     */
    function pdmShowPanel() {
        console.log("Executing Command pdmShowPanel");
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
    CommandManager.register(Strings.MENU_NAME, COMMAND_ID, pdmShowPanel);
    var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
    menu.addMenuItem(COMMAND_ID);

    // Listener for toolbar icon
    $icon.click(function () {
        CommandManager.execute(COMMAND_ID);
    }).appendTo("#main-toolbar .buttons");


    function updateSearch(data, selector) {
        var template = require("text!../html/search.html"),
            templateHtml = Mustache.render(template, data);

        $(selector).html(templateHtml);
//        $(selector).html(templateHtml);

    }

    function updateResults(data, selector) {
        var template = require("text!../html/results.html"),
            templateHtml = Mustache.render(template, data);

        $(selector).html(templateHtml);

    }

    function addPanel(data) {
        var template = require("text!../html/panel.html");
        var panelHtml = Mustache.render(template, data);

        panel = PanelManager.createBottomPanel(COMMAND_ID, $(panelHtml), 200);
    }

    addPanel(Strings);


    exports.updateSearch = updateSearch;
    exports.updateResults = updateResults;
    exports.pdmShowPanel = pdmShowPanel;
});
