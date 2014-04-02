/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

/**
 * Template for modules
 * @module Template
 */

define(function (require, exports, module) {
    'use strict';

    // Dependencies
    var NodeConnection = brackets.getModule("utils/NodeConnection"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        ProjectManager = brackets.getModule("project/ProjectManager"),

        projectDirectory = ProjectManager.getProjectRoot(),
        Node             = require("modules/Node"),
        Result           = require("modules/Result"),
        Status           = require("modules/Status"),
        DOMAIN           = "brackets-cardboard",
        PATH             = projectDirectory._path,
        MANAGER          = "bower.js", //same as your file name
        NAME             = "Bower"; // display name

    Node.fail(function (err){
     console.error('Error with Node', err);
    });

    /**
     * To use Node, each command must be wrapped in a done function
     * See domains.js, and the following example:
     *
     */

     // Node.done(function(nodeComamnd) {
     //    var ls = nodeComamnd(dir._path, 'ls', ['-l', '-a']);
     //    ls.fail(function (err) {
     //        console.log('command failed', err);
     //    });
     //    ls.done(function (stdout) {
     //        console.log(stdout);
     //    });
     // });

    /**
     * Install command
     * @param  {String} packageName A unique name of a package/dependency to install
     * @return {Status}             Status object
     */
    function install (packageName) {
        // global node bin path
        // bower install

        var results = [];
        var deferred = $.Deferred();

        Node.done(function(nodeCommand) {

            var command = nodeCommand.execute(PATH, 'npm', ['-g', 'bin']);

            command.fail(function (err) {
                console.error('Could not get global npm bin path', err);
            });
            command.then(function (stdout) {
                var BOWERPATH = stdout;
                console.debug(stdout);
                return BOWERPATH;
            }).done(function (BOWERPATH){

                var install = nodeCommand.execute(PATH, BOWERPATH + '/bower', ['-j', 'install', packageName]);

                install.fail(function (err) {
                    console.error('Could not install bower package', packageName, err);
                });
                install.done(function (stdout) {
                    var response = JSON.parse(stdout);

                    if ($.isEmptyObject(response)) {
                        console.log(packageName, "already installed");
                    } else {
                        var status = new Status(response[packageName].endpoint.name, MANAGER, "installed");
                        deferred.resolve(status);
                    }
                }) // install
            }); // command
        }); // node

        results.push(deferred.promise());
        return results;
    }

    /**
     * Uninstall command
     * @param  {String} packageName A unique name of a package/dependency to uninstall
     * @return {Status}             Status object
     */
    function uninstall (packageName) {
        // global node bin path
        // bower uninstall

        var results = [];
        var deferred = $.Deferred();

        Node.done(function(nodeCommand) {

            var command = nodeCommand.execute(PATH, 'npm', ['-g', 'bin']);

            command.fail(function (err) {
                console.error('Could not get global npm bin path', err);
            });
            command.then(function (stdout) {
                var BOWERPATH = stdout;
                console.debug(stdout);
                return BOWERPATH;
            }).done(function (BOWERPATH){

                var install = nodeCommand.execute(PATH, BOWERPATH + '/bower', ['-j', 'uninstall', packageName]);

                install.fail(function (err) {
                    console.error('Could not install bower package', packageName, err);
                });
                install.done(function (stdout) {
                    var response = JSON.parse(stdout);

                    if ($.isEmptyObject(response)) {
                        console.log(packageName, "not installed");
                    } else {
                        var status = new Status(packageName, MANAGER, "uninstalled");
                        deferred.resolve(status);
                    }
                }) // install
            }); // command
        }); // node

        results.push(deferred.promise());
        return results;
    }

    /**
     * Update command
     * @param  {String} packageName A unique name of a package/dependency to update
     * @return {Status}             Status object
     */
    function update (packageName) {

    }

    /**
     * Search for package/dependency
     * @param  {String} query Search query
     * @return {Array}        Array of Result objects
     */
    function search (query) {
        // global node bin path
        // bower search
        // bower info

        var results = [];
        var deferred = $.Deferred();

        Node.done(function(nodeCommand) {

            var command = nodeCommand.execute(PATH, 'npm', ['-g', 'bin']);

            command.fail(function (err) {
                console.error('Could not get global npm bin path', err);
            });
            command.then(function (stdout) {
                var BOWERPATH = stdout;
                console.debug(stdout);
                return BOWERPATH;
            }).done(function (BOWERPATH){

                var list = nodeCommand.execute(PATH, BOWERPATH + '/bower', ['-j', 'search', query]);

                list.fail(function (err) {
                    console.error('Could not list bower packages', err);
                });
                list.then(function (stdout) {
                    var search = JSON.parse(stdout);
                    console.debug(search);
                    return search;
                }).done(function (search) {

                    var pkgInfo = [];

                    search.forEach(function (pkg) {
                        var info = nodeCommand.execute(PATH, BOWERPATH + '/bower', ['-j', 'info', pkg.url]);
                        var pkgDeferred = $.Deferred();

                        info.fail(function (err) {
                            console.error('Could not list bower packages', err);
                        });
                        info.done(function (stdout) {
                            var details = JSON.parse(stdout);

                            //id, manager, primary, secondary, link, data1, data2, data3, status
                            pkgDeferred.resolve(new Result(details.latest.name, MANAGER, details.latest.name, details.latest.description, details.latest.homepage, 'Version ' + details.latest.version, 'License ' + details.latest.license, '', ''));

                        }); // info

                        pkgInfo.push(pkgDeferred.promise());
                    }); //forEach

                    deferred.resolve(pkgInfo);
                }); // list
            }); // command
        }); // node

        results.push(deferred.promise());
        return results;
    }

    /**
     * Lists installed packages/dependencies
     * @return {Array} Array of Result objects
     */
    function getInstalled () {
        // global node bin path
        // bower list
        // bower info

        var results = [];
        var deferred = $.Deferred();

        Node.done(function(nodeCommand) {

            var command = nodeCommand.execute(PATH, 'npm', ['-g', 'bin']);

            command.fail(function (err) {
                console.error('Could not get global npm bin path', err);
            });
            command.then(function (stdout) {
                var BOWERPATH = stdout;
                console.debug(stdout);
                return BOWERPATH;
            }).done(function (BOWERPATH){

                var list = nodeCommand.execute(PATH, BOWERPATH + '/bower', ['-j', 'list']);

                list.fail(function (err) {
                    console.error('Could not list bower packages', err);
                });
                list.done(function (stdout) {
                    var deps = JSON.parse(stdout),
                        depsArray = [],
                        keys = Object.keys(deps.dependencies);
                    console.debug(deps);

                    keys.forEach(function (pkg) {
                        //id, manager, primary, secondary, link, data1, data2, data3, status
                        depsArray.push(new Result(deps.dependencies[pkg].pkgMeta.name, MANAGER, deps.dependencies[pkg].pkgMeta.name, deps.dependencies[pkg].pkgMeta.description, deps.dependencies[pkg].pkgMeta.homepage, 'Version ' + deps.dependencies[pkg].pkgMeta.version, 'License ' + deps.dependencies[pkg].pkgMeta.license, '', 'installed'));
                    });

                    deferred.resolve(depsArray);
                }); // list
            }); // command
        }); // node

        results.push(deferred.promise());
        return results;
    }

    // Helper methods

    /**
     * Determines if the manager is available/reachable from brackets-cardboard
     * @return {Object} Object with keys of manager and displayAs
     */
    function isAvailable () {
        return {
            "manager" : MANAGER,
            "displayAs" : NAME
        };
    }

    /**
     * Gets the README URL of a package/dependency
     * @param  {String} packageName A unique name of a package/dependency
     * @return {String}             README URL of package/dependency
     */
    function getReadme (packageName) {

    }

    /**
     * Gets the URL of a package/dependency
     * @param  {String} packageName A unique name of a package/dependency
     * @return {String}             URL of package/dependency
     */
    function getUrl (packageName) {
        var deferred = $.Deferred();

        Node.done(function(nodeCommand) {

            var command = nodeCommand.execute(PATH, 'npm', ['-g', 'bin']);

            command.fail(function (err) {
                console.error('Could not get global npm bin path', err);
            });
            command.then(function (stdout) {
                var BOWERPATH = stdout;
                console.debug(stdout);
                return BOWERPATH;
            }).done(function (BOWERPATH){

                var list = nodeCommand.execute(PATH, BOWERPATH + '/bower', ['-j', 'lookup', packageName]);

                list.fail(function (err) {
                    console.error('Could not lookup bower package url', err);
                });
                list.then(function (stdout) {
                    var search = JSON.parse(stdout);
                    console.debug(search.url);
                    deferred.resolve(search.url);
                });
            });
        });

        return deferred.promise();
    }

    exports.install      = install;
    exports.uninstall    = uninstall;
    exports.update       = update;
    exports.search       = search;
    exports.getInstalled = getInstalled;
    exports.isAvailable  = isAvailable;
    exports.getReadme    = getReadme;
    exports.getUrl       = getUrl;

});

//sdg
