/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

/*
    example.js
    Provides a manager example and tests.
 */

define(function (require, exports, module) {
    'use strict';

    // Dependencies
    var Result            = require("modules/Result"),
        Status            = require("modules/Status"),
        MANAGER           = "test.js",
        UPDATED           = "updated";

    // install command for manager
    // returns status, error
    function install (packageName) {
        var status = new Status();
        status.id = packageName;
        status.manager = MANAGER;
        status.status = "installed";
        return status;
    }

    // uninstall command for manager
    // returns status, error
    function uninstall (packageName) {
        var status = new Status();
        status.id = packageName;
        status.manager = MANAGER;
        status.status = "uninstalled";
        return status;
    }

    // update command for manager
    // returns status, error
    function update (packageName) {
        var status = new Status(packageName, MANAGER, UPDATED);
        return status;
    }

    // search command for manager
    // returns array of objects
    function search (query) {
        var result1 = new Result();
        result1.id = "brackets-pdm";
        result1.manager = MANAGER;
        result1.primary =  "brackets-pdm";
        result1.secondary = "Some descriptiong tat is really long and have spelling mistakes";
        result1.link = "http://github.com/khornberg/brackets-cardboard";
        result1.data1 = "Updated 12 hours ago";
        result1.data2 = "<i class='fa fa-code-fork'></i> 2 Forks";
        result1.data3 = "<i class='fa fa-star'></i> 4 Stars";
        result1.status = "installed";

        var result2 = new Result("non-installed-2", MANAGER, "Primary name of result", "Secondary descriptoing :)", "http://github.com/khornberg/brackets-git", "Update yesterday", "500 forks", "1,200 Stars");

        return [result1, result2];
    }

    // get installed packages or dependencies
    // returns array of objects
    function getInstalled () {
        var result1 = new Result();
        result1.id = "brackets-pdm";
        result1.manager = MANAGER;
        result1.primary ="Brackets PDM";
        result1.link = "http://github.com/khornberg/brackets-pdm";
        result1.data1 = "<a href='http://github.com/khornberg/brackets-pdm/blob/master/README.md'>README</a>";
        result1.status = "installed";

        return [result1];
    }

    // Helper methods

    // determines if the manager is available / reachable from brackets
    // returns object {manager: name, displayAs, text} if available
    function isAvailable () {
        return {"manager" : MANAGER, "displayAs" : "Test" };
    }

    // get readme url
    // returns url of readem for package
    function getReadme (packageName) {
        var readme = "http://github.com/user/" + packageName + "/README.md";
        return readme;
    }

    // get project url
    // returns url of package
    function getUrl (packageName) {
        var url = "http://github.com/user/" + packageName;
        return url;
    }

    // API
    exports.install = install;
    exports.uninstall = uninstall;
    exports.update = update;
    exports.search = search;
    exports.getInstalled = getInstalled;
    exports.isAvailable = isAvailable;
    exports.getReadme = getReadme;
    exports.getUrl = getUrl;

});
