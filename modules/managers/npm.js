/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

/**
 * npm module
 * @class  npm
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
        MANAGER          = "npm.js", //same as your file name
        NAME             = "npm"; // display name

    Node.fail(function (err){
        console.error('Error with Node', err);
    });

    /**
     * Install command
     * @memberof npm
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
                // Return error message
            });
            command.then(function (stdout) {
                var BOWERPATH = stdout;
                console.debug(stdout);
                return BOWERPATH;
            }).done(function (BOWERPATH){

                var install = nodeCommand.execute(PATH, BOWERPATH + '/bower', ['-j', 'install', packageName]);

                install.fail(function (err) {
                    console.error('Could not install bower package', packageName, err);
                    // Return error message
                });
                install.done(function (stdout) {
                    var response = JSON.parse(stdout);

                    if ($.isEmptyObject(response)) {
                        console.log(packageName, "already installed");
                    } else {
                        var status = new Status(response[packageName].endpoint.name, MANAGER, "installed");
                        deferred.resolve(status);
                    }
                }); // install
            }); // command
        }); // node

        results.push(deferred.promise());
        return results;
    }

    /**
     * Uninstall command
     * @memberof npm
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
                // Return error message
            });
            command.then(function (stdout) {
                var BOWERPATH = stdout;
                console.debug(stdout);
                return BOWERPATH;
            }).done(function (BOWERPATH){

                var install = nodeCommand.execute(PATH, BOWERPATH + '/bower', ['-j', 'uninstall', packageName]);

                install.fail(function (err) {
                    console.error('Could not uninstall bower package', packageName, err);
                    // Return error message
                });
                install.done(function (stdout) {
                    var response = JSON.parse(stdout);

                    if ($.isEmptyObject(response)) {
                        console.log(packageName, "not installed");
                    } else {
                        var status = new Status(packageName, MANAGER, "uninstalled");
                        deferred.resolve(status);
                    }
                }); // uninstall
            }); // command
        }); // node

        results.push(deferred.promise());
        return results;
    }

    /**
     * Update command
     * @memberof npm
     * @param  {String} packageName A unique name of a package/dependency to update
     * @return {Status}             Status object
     */
    function update (packageName) {
        // global node bin path
        // bower update

        var results = [];
        var deferred = $.Deferred();

        Node.done(function(nodeCommand) {

            var command = nodeCommand.execute(PATH, 'npm', ['-g', 'bin']);

            command.fail(function (err) {
                console.error('Could not get global npm bin path', err);
                // Return error message
            });
            command.then(function (stdout) {
                var BOWERPATH = stdout;
                console.debug(stdout);
                return BOWERPATH;
            }).done(function (BOWERPATH){

                var install = nodeCommand.execute(PATH, BOWERPATH + '/bower', ['-j', 'update', packageName]);

                install.fail(function (err) {
                    console.error('Could not update bower package', packageName, err);
                    // Return error message
                });
                install.done(function (stdout) {
                    var response = JSON.parse(stdout);

                    if ($.isEmptyObject(response)) {
                        console.log(packageName, "not updated");
                    } else {
                        var status = new Status(packageName, MANAGER, "updated");
                        deferred.resolve(status);
                    }
                }); // update
            }); // command
        }); // node

        results.push(deferred.promise());
        return results;
    }

    /**
     * Search for package/dependency
     * @memberof npm
     * @param  {String} query Search query
     * @return {Array}        Array of Result objects
     */
    function search (query) {
        // npm search


        var results = [];
        var deferred = $.Deferred();

        Node.done(function(nodeCommand) {

            var command = nodeCommand.execute(PATH, 'npm', ['search', '-q', query]);

            command.fail(function (err) {
                console.error('Could not search npm', err);
            });
            command.done(function (stdout) {
                var details = stdout.split('\n').slice(1);

                details.forEach(function(line) {
                    var data = line.match(/\s.*/)[0].split('='),
                        name = line.split(' ', 1)[0], 
                        desc = data[0].trim(), 
                        date = data[1].match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/)[0], 
                        version = data[1].match(/\d\.\d\.\d/)[0], 
                        keywords = data[1].split(/\d\.\d\.\d/)[1].trim().split(' '),
                        pkg = [name, desc, date, version, keywords];

                        // //id, manager, primary, secondary, link, data1, data2, data3, status
                        // var id        = details.latest.name,
                        //     primary   = details.latest.name,
                        //     secondary = details.latest.description || '',
                        //     link      = details.latest.homepage,
                        //     data1     = 'Version ' + (details.latest.version || 'Unknown'),
                        //     data2     = 'License ' + (details.latest.license || 'Unknown'),
                        //     data3     = '<div class="bower"></div>',
                        //     status    = '',
                        //     button   = '';

                        // deferred.resolve(new Result(id, MANAGER, primary, secondary, link, data1, data2, data3, status, button));
                        console.debug('npm search', pkg);
                })
            }); // command
        }); // node

        results.push(deferred.promise());
        return results;
    }

    /**
     * Lists installed packages/dependencies
     * @memberof npm
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
                // Return error message
            });
            command.then(function (stdout) {
                var BOWERPATH = stdout;
                console.debug(stdout);
                return BOWERPATH;
            }).done(function (BOWERPATH){

                var list = nodeCommand.execute(PATH, BOWERPATH + '/bower', ['-j', 'list']);

                list.fail(function (err) {
                    console.error('Could not list bower packages', err);
                    // Return error message
                });
                list.done(function (stdout) {
                    var deps = JSON.parse(stdout),
                        depsArray = [],
                        keys = Object.keys(deps.dependencies);
                    console.debug(deps);

                    keys.forEach(function (pkg) {
                        //id, manager, primary, secondary, link, data1, data2, data3, status
                        var id        = deps.dependencies[pkg].pkgMeta.name,
                            primary   = deps.dependencies[pkg].pkgMeta.name,
                            secondary = deps.dependencies[pkg].pkgMeta.description || '',
                            link      = deps.dependencies[pkg].pkgMeta.homepage,
                            data1     = 'Version ' + (deps.dependencies[pkg].pkgMeta.version || 'Unknown'),
                            data2     = 'License ' + (deps.dependencies[pkg].pkgMeta.license || 'Unknown'),
                            data3     = '',
                            status    = 'installed',
                            button    = 'installed';

                        depsArray.push(new Result(id, MANAGER, primary, secondary, link, data1, data2, data3, status, button));
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
     * @memberof npm
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
     * @memberof npm
     * @param  {String} packageName A unique name of a package/dependency
     * @return {String}             README URL of package/dependency
     */
    function getReadme (packageName) {

    }

    /**
     * Gets the URL of a package/dependency
     * @memberof npm
     * @param  {String} packageName A unique name of a package/dependency
     * @return {String}             URL of package/dependency
     */
    function getUrl (packageName) {
        var deferred = $.Deferred();

        Node.done(function(nodeCommand) {

            var command = nodeCommand.execute(PATH, 'npm', ['-g', 'bin']);

            command.fail(function (err) {
                console.error('Could not get global npm bin path', err);
                // Return error message
            });
            command.then(function (stdout) {
                var BOWERPATH = stdout;
                console.debug(stdout);
                return BOWERPATH;
            }).done(function (BOWERPATH){

                var list = nodeCommand.execute(PATH, BOWERPATH + '/bower', ['-j', 'lookup', packageName]);

                list.fail(function (err) {
                    console.error('Could not lookup bower package url', err);
                    // Return error message
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
