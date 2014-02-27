/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, Mustache, _ */

/** brackets-pdm (Brackets Package/Dependency Manager) Extension
    Manage packages/dependencies for your project.
    Copyright 2014 Kyle Hornberg
    LICENSE Apache 2.0
*/
define(function (require, exports, module) {
    'use strict';

    console.log("INITIALIZING brackets-pdm EXTENSION");

    // Modules
    var CommandManager    = brackets.getModule("command/CommandManager"),
        Menus             = brackets.getModule("command/Menus"),
        PanelManager      = brackets.getModule("view/PanelManager"),
        ExtensionUtils    = brackets.getModule("utils/ExtensionUtils"),
        AppInit           = brackets.getModule("utils/AppInit"),
        FileSystem        = brackets.getModule("filesystem/FileSystem"),
        _                 = brackets.getModule("thirdparty/lodash"),

        // Setup Extension
        moduleDirectory   = ExtensionUtils.getModulePath(module),
        managerDirectory  = moduleDirectory + "modules/managers",

        Interface         = require("modules/Interface"),
        Strings           = require("./strings"),

        COMMAND_ID        = "backets-pdm.pdmShowPanel",
        $icon             = $( "<a href='#' title='" + Strings.EXTENSION_NAME + "' id='brackets-pdm-icon'></a>" ),
        panel             = null;




    // Tests in liue of unittest not working-----------------------
    var testData = {};
    testData.getManagers = Interface.getManagers();
    testData.getAvailble = Interface.getAvailable();
    testData.install     = Interface.install(testData.getManagers[0], "Package 1");
    testData.uninstall   = Interface.uninstall(testData.getManagers[0], "package :( ");
    testData.update      = Interface.update(testData.getManagers[0], "package ...");
    testData.searchSpec  = Interface.search(testData.getManagers[1], "PKG");
    testData.search      = Interface.search("PKG");
    testData.list        = Interface.list(testData.getManagers[0]);
    testData.getConfig   = Interface.getConfig(testData.getManagers[1]);
//    testData.openReadme  = Interface.openReadme(testData.getManagers[0], "PACKage");
//    testData.openUrl     = Interface.openUrl(testData.getManagers[0], "pakage");

    console.log(testData);

    // --------------------------------------------------------------

    // Load CSS
    ExtensionUtils.loadStyleSheet(module, "less/brackets-pdm.less");

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

    AppInit.appReady(function () {

        // Set up UI
        CommandManager.register(Strings.MENU_NAME, COMMAND_ID, pdmShowPanel);

        var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
        menu.addMenuItem(COMMAND_ID);

        var template = require("text!html/panel.html"),
            data = _.merge(Strings, testData),
            panelHtml = Mustache.render(template, data);

        panel = PanelManager.createBottomPanel(COMMAND_ID, $(panelHtml), 200);

        // Listener for toolbar icon
        $icon.click(function () {
            CommandManager.execute(COMMAND_ID);
        }).appendTo("#main-toolbar .buttons");
    });

});
