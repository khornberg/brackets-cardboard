/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, Mustache, _ */

/** 
    brackets-cardboard Brackets Cardboard Extension
    Manage packages/dependencies for your project.
    Copyright 2014 Kyle Hornberg
    LICENSE Apache 2.0
*/

define(function (require, exports, module) {
    'use strict';

    console.log("INITIALIZING brackets-cardboard EXTENSION");

    // Modules
    var CommandManager    = brackets.getModule("command/CommandManager"),
        ExtensionUtils    = brackets.getModule("utils/ExtensionUtils"),
        AppInit           = brackets.getModule("utils/AppInit"),

        FileSystem        = brackets.getModule("filesystem/FileSystem"),
        _                 = brackets.getModule("thirdparty/lodash"),

        // Setup Extension
        moduleDirectory   = ExtensionUtils.getModulePath(module),
        managerDirectory  = moduleDirectory + "modules/managers",

        Interface         = require("modules/Interface"),
        Ui                = require("modules/Ui"),
        Result            = require("modules/Result");

    
    
    // Tests in lieu of unittest not working-----------------------
    var testData = {};
    testData.getManagers  = Interface.getManagers();
    testData.getAvailable = Interface.getAvailable();
    testData.install      = Interface.install(testData.getManagers[0], "Package 1");
    testData.uninstall    = Interface.uninstall(testData.getManagers[0], "package :( ");
    testData.update       = Interface.update(testData.getManagers[0], "package ...");
    testData.searchSpec   = Interface.search(testData.getManagers[1], "PKG");
    testData.search       = Interface.search("PKG");
    testData.list         = Interface.list(testData.getManagers[0]);
    testData.getConfig    = Interface.getConfig(testData.getManagers[1]);
//    testData.openReadme  = Interface.openReadme(testData.getManagers[0], "PACKage");
//    testData.openUrl     = Interface.openUrl(testData.getManagers[0], "pakage");

    console.log(testData);

    // --------------------------------------------------------------

    // Load CSS
    ExtensionUtils.loadStyleSheet(module, "css/brackets-cardboard.css");
    ExtensionUtils.loadStyleSheet(module, "css/font-awesome.min.css");



    AppInit.appReady(function () {

        // Panel
        Ui.listManagers(_.pick(testData, 'getAvailable'), '#brackets-cardboard-managers');
        
        var data = { "results" : _.flatten(testData.search) };
        data.results[0].installed = "installed";
        data.results[2].installed = "update";
        console.log(data);
        Ui.updateResults(data, '.brackets-cardboard-table');
        

    });

});
