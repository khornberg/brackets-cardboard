/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

/*
    Interface.js
    Provides the abstract interface for all managers.
*/

define(function (require, exports, module) {
    'use strict';

    // Dependencies
    var ExtensionUtils      = brackets.getModule("utils/ExtensionUtils"),
        moduleDirectory     = ExtensionUtils.getModulePath(module),
//        _                 = brackets.getModule("thirdparty/lodash"),

        //Tests directory
        managerDirectory    = moduleDirectory + "../tests/managers/",
//        managerDirectory  = moduleDirectory + "/managers/",

        // Managers
        managerModules      = ["template.js", "template2.js"],
        template            = require("tests/managers/template"),
        template2           = require("tests/managers/template2");


    // install command for manager
    // manager to send command to
    // name package name
    // returns result
    function install (managerModule, packageName) {
        var deferred = $.Deferred();

        require([managerDirectory + managerModule], function (manager) {
            deferred.resolve( manager.install(packageName) );
        });
        return deferred.promise();
    }

    // uninstall command for manager
    function uninstall (managerModule, packageName) {
        var deferred = $.Deferred();

        require([managerDirectory + managerModule], function (manager) {
            deferred.resolve( manager.uninstall(packageName) );
        });
        return deferred.promise();
    }

    // update command for manager
    function update (managerModule, packageName) {
        var deferred = $.Deferred();

        require([managerDirectory + managerModule], function (manager) {
            deferred.resolve( manager.update(packageName) );
        });
        return deferred.promise();
    }

    // search command for manager
    /*
        Searches one or more managers for a package
        @param String name specific manager to search, optional
        @param String query package name

        @returns Array of search result objects
    */
    function search () {
        var searchManager = (arguments.length > 1) ? arguments[0] : undefined,
            query = (arguments.length > 1) ? arguments[1]: arguments[0],
            results = [];

        // search using a single manager
        if (searchManager !== undefined) {
            var deferred = $.Deferred();

            require([managerDirectory + searchManager], function (manager) {
                deferred.resolve(manager.search(query));
            });
            results.push(deferred.promise());

            return results;
        }

        managerModules.forEach(function (managerModule) {
            var deferred = $.Deferred();

            require([managerDirectory + managerModule], function (manager) {
                deferred.resolve(manager.search(query));
            });
            results.push(deferred.promise());
        });


        return results;
    }

    // list installed packages or dependencies
    function list (managerName) {
        var results = [];

        managerModules.forEach(function (managerModule) {
            var deferred = $.Deferred();

            require([managerDirectory + managerModule], function (manager) {
                if (manager === managerName) {
                    deferred.resolve(manager.list());
                    results.push(deferred.promise());
                    return results;
                }

                deferred.resolve(manager.list());
            });
            results.push(deferred.promise());
        });
        return results;
    }


    // Helper methods


    // get manager modules
    // currently a static list as an array
    function getManagers () {
        return managerModules;
    }

    // returns available managers
    function getAvailable () {
        var available = [];

        managerModules.forEach(function (managerModule) {
            var deferred = $.Deferred();

            require([managerDirectory + managerModule], function (manager) {
                 deferred.resolve(manager.isAvailable());
            });
            available.push(deferred.promise());
        });
        return available;
    }

    // get configuration for manager so cardboard knows where to look for installed pagages
    // returns configuration object (remember to JSON.parse if returning json)
    function getConfig (managerModule) {
        var deferred = $.Deferred();

        require([managerDirectory + managerModule], function (manager) {
            deferred.resolve( manager.getConfig() );
        });
        return deferred.promise();
    }

    // opens readme in default browser
    function openReadme (managerModule, packageName) {
        var NativeApp = brackets.getModule("utils/NativeApp");

        require([managerDirectory + managerModule], function (manager) {
            NativeApp.openURLInDefaultBrowser(manager.getReadme(packageName));
        });
    }

    // opens project url in default brwoser
    function openUrl (managerModule, packageName) {
        var NativeApp = brackets.getModule("utils/NativeApp");

        require([managerDirectory + managerModule], function (manager) {
            NativeApp.openURLInDefaultBrowser(manager.getUrl(packageName));
        });
    }

    // API
    exports.install         = install;
    exports.uninstall       = uninstall;
    exports.update          = update;
    exports.search          = search;
    exports.list            = list;
    exports.getManagers     = getManagers;
    exports.getAvailable    = getAvailable;
    exports.getConfig       = getConfig;
    exports.openReadme      = openReadme;
    exports.openUrl         = openUrl;
});
