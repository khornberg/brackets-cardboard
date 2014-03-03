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
        Interface         = require("modules/Interface"),

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
            .on( "click", ".close", function () {
                console.log("close");
                panel.hide();
                $icon.removeClass("active");
                CommandManager.get(COMMAND_ID).setChecked(false);
            })
            .on( "click", "#brackets-cardboard-show", function () {
                console.log("show");
                var $results = $('tr:not(.brackets-cardboard-result-installed):not(.brackets-cardboard-result-update)', $('.brackets-cardboard-table tbody')),
                    $show = $('#brackets-cardboard-show');
                
                $results.toggle();
                
                if ($show.html === Strings.SHOW_ALL) {
                    $(this).html(Strings.SHOW_INSTALLED);
                } else {
                    $(this).html(Strings.SHOW_ALL);
                }
            })
            .on( "keydown", ".brackets-cardboard-search input", function (event) {
                if(event.which === 13) {
                    var query = $(this).val(),
                        manager = $('#brackets-cardboard-managers .dropdown').text();
                    console.log("search " + query + " manager " + manager);
                    if (manager === Strings.SEARCH_ALL) {
                        Interface.search(query);
                    } else {
                        Interface.search(manager, query);
                    }
                }
            })
            .on( "click", ".brackets-cardboard-manager", function () {
                console.log($(this).text());
                $(this).parent().prev().html($(this).text() + ' <span class="caret"></span>');
            })
            .on( "click", ".brackets-cardboard-install", function () {
                var id = $(this).parents("tr").attr("data-id"),
                    manager = $(this).parents("tr").attr("data-manager");
                console.log("instal " + id + " manager " + manager);
                Interface.install(manager, id);
            })
            .on( "click", ".brackets-cardboard-update", function () {
                var id = $(this).parents("tr").attr("data-id"),
                    manager = $(this).parents("tr").attr("data-manager");
                console.log("update " + id + " manager " + manager);
                Interface.update(manager, id);
            })
            .on( "click", ".brackets-cardboard-uninstall", function () {
                var id = $(this).parents("tr").attr("data-id"),
                    manager = $(this).parents("tr").attr("data-manager");
                console.log("uninstal " + id + " manager " + manager);
                Interface.uninstall(manager, id);
            })
        ;
    }
    addPanel(Strings);
    
    // Listener for toolbar icon
    $icon.click(function () {
        CommandManager.execute(COMMAND_ID);
    }).appendTo("#main-toolbar .buttons");


    exports.listManagers = listManagers;
    exports.updateResults = updateResults;
    exports.cardboardShowPanel = cardboardShowPanel;
});
