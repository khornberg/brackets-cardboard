/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

/*
    template.js
    Provides a manager template and tests.
 */

define(function (require, exports, module) {
    'use strict';

    // Dependencies

    var Result            = require("modules/Result"),
        MANAGER = "Test2";

    // install command for manager
    // returns status, error
    function install (packageName) {
        var status = packageName + " installed.";
        return status;
    }

    // uninstall command for manager
    // returns status, error
    function uninstall (packageName) {
        var status = packageName + " uninstalled.";
        return status;
    }

    // update command for manager
    // returns status, error
    function update (packageName) {
        var status = packageName + " updated.";
        return status;
    }

    // search command for manager
    // returns array of objects
    function search (query) {
        var result1 = new Result();
        result1.id = query;
        result1.manager = MANAGER;
        result1.primary =  "Test nothing " + query;
        result1.secondary = "Some descriptiong tat is really long and have spelling mistakesSome descriptiong tat is really long and have spelling mistakesSome descriptiong tat is really long and have spelling mistakes";
        result1.link = "http://github.com/khornberg/brackets-nothing";
        result1.data1 = "Updated 18 hours ago";
        result1.data2 = "2 Forks";
        result1.data3 = "<a href='" + result1.link + "'>README</a>";
            
        var result2 = new Result(query + " nohting", MANAGER, query + " nohting", "Secondary descriptoing :)", "http://github.com/khornberg/brackets-git", "Update yesterday", "2 forks", "1,2 Stars");
        
        return [result1, result2];
    }

    // get installed packages or dependencies
    // returns array of objects
    function list () {
        var result1 = new Result(
            "phpDOC",
            MANAGER,
            "Test2 phpDOC",
            "",
            "http://github.com/khornberg/phpDOC",
            "",
            "",
            "<a href='http://github.com/khornberg/brackets-pdm/blob/master/README.md'>README</a>"
            );
        return [result1];
    }

    // Helper methods

    // determines if the manager is available / reachable from brackets
    // returns object {manager: boolean}
    function isAvailable () {
        return MANAGER;
    }

    // get configuration for manager so pdm knows where to look for installed
    // returns object of configuration data
    function getConfig () {
        var config = { "directory": "app/bower" };
        return config;
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
    exports.list = list;
    exports.isAvailable = isAvailable;
    exports.getConfig = getConfig;
    exports.getReadme = getReadme;
    exports.getUrl = getUrl;

});
