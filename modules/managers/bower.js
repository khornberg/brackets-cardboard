/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, Mustache */

/**
 * Bower module
 * @class  bower
 */

define(function (require, exports, module) {
    'use strict';

    // Dependencies
    var NodeConnection = brackets.getModule("utils/NodeConnection"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        ProjectManager = brackets.getModule("project/ProjectManager"),
        Dialogs        = brackets.getModule("widgets/Dialogs"),
        _              = brackets.getModule("thirdparty/lodash"),

        Strings          = require("strings"),
        projectDirectory = ProjectManager.getProjectRoot(),
        errorTemplate    = require("text!html/errorModal.html"),
        Node             = require("modules/Node"),
        Result           = require("modules/Result"),
        Status           = require("modules/Status"),
        Batch            = require("node_modules/batch/index"),
        DOMAIN           = "brackets-cardboard",
        PATH             = projectDirectory._path,
        MANAGER          = "bower.js", //same as your file name
        NAME             = "Bower", // display name
        SEARCH_URL       = "http://bower.io/search";

    Node.fail(function (err){
        console.error('Error with Node', err);
    });

    /**
     * To use Node, each command must be wrapped in a done function
     * See domains.js, and the following example:
     * Node.done(function(nodeComamnd) {
     *      var ls = nodeComamnd(dir._path, 'ls', ['-l', '-a']);
     *      ls.fail(function (err) {
     *          console.log('command failed', err);
     *      });
     *      ls.done(function (stdout) {
     *          console.log(stdout);
     *      });
     *   });
     *
     */

    /**
     * Install command
     * @memberof bower
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
                showModal(err);
            });
            command.then(function (stdout) {
                var BOWERPATH = stdout;
                console.debug(stdout);
                return BOWERPATH;
            }).done(function (BOWERPATH){

                var install = nodeCommand.execute(PATH, BOWERPATH + '/bower', ['-j', 'install', packageName]);

                 install.fail(function (err) {
                     console.error('Could not install bower package', packageName, err);
                     //TODO return a result on error
//                     showModal(err);
//                     var status = new Status(packageName, MANAGER, "error", err[0].message);
//                     deferred.reject(status);
                 });
                install.done(function (stdout) {
                    var response = JSON.parse(stdout);

                    if ($.isEmptyObject(response)) {
                        console.log(packageName, "already installed");
                    } else {
                        var keys = Object.keys(response);
                        var status = new Status(response[keys[0]].endpoint.name, MANAGER, "installed");
                        deferred.resolve(status);
                    }
                });
                install.always(function (err) {
                    console.debug("debug", err);
                    var response = JSON.parse(err);
                    var status = new Status(packageName, MANAGER, "error", response[0].message);
                    deferred.resolve(status);
                }); // install
            }); // command
        }); // node

        results.push(deferred.promise());
        return results;
    }

    /**
     * Uninstall command
     * @memberof bower
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
                showModal(err);
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
                    showModal(err);
                });
                install.done(function (stdout) {
                    var response = JSON.parse(stdout);

                    if ($.isEmptyObject(response)) {
                        console.log(packageName, "not installed");
                    } else {
                        var status = new Status(packageName, MANAGER, "uninstalled");
                        deferred.resolve(status);
                    }
                });
                install.always(function (err) {
                    console.debug("debug", err);
                    var response = JSON.parse(err);
                    var status = new Status(packageName, MANAGER, "error", response[0].message);
                    deferred.resolve(status);
                });// uninstall
            }); // command
        }); // node

        results.push(deferred.promise());
        return results;
    }

    /**
     * Update command
     * @memberof bower
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
                showModal(err);
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
                    showModal(err);
                });
                install.done(function (stdout) {
                    var response = JSON.parse(stdout);

                    if ($.isEmptyObject(response)) {
                        console.log(packageName, "not updated");
                    } else {
                        var status = new Status(packageName, MANAGER, "updated");
                        deferred.resolve(status);
                    }
                });
                install.always(function (err) {
                    console.debug("debug", err);
                    var response = JSON.parse(err);
                    var status = new Status(packageName, MANAGER, "error", response[0].message);
                    deferred.resolve(status);
                }); // update
            }); // command
        }); // node

        results.push(deferred.promise());
        return results;
    }

    /**
     * Search for package/dependency
     * @memberof bower
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
                showModal(err);
            });
            command.then(function (stdout) {
                var BOWERPATH = stdout;
                console.debug(stdout);
                return BOWERPATH;
            }).done(function (BOWERPATH){

                var list = nodeCommand.execute(PATH, BOWERPATH + '/bower', ['-j', 'search', query]);

                list.fail(function (err) {
                    console.error('Could not list bower packages', err);
                    // Return error message
                    showModal(err);
                });
                list.done(function (stdout) {
                    var searchResults = JSON.parse(stdout),
                        pkgInfo = [];

                    if (searchResults.length === 0) {
                        // TODO refactor this into a message
                        console.log('No results for', query);
                        pkgInfo.push(new Result('', MANAGER, 'No results found for ' + query, '', SEARCH_URL, '', '', '', 'update', 'none'));
                        deferred.resolve(pkgInfo);
                        return;
                    }

                    if (searchResults.length > 50) {
                        showModal('Whoa there. Narrow your search. You\'ll lock your self out of Github');
                        return;
                    }

                    var batch = new Batch;
                    batch.concurrency(5);

                    searchResults.forEach(function (pkg) {
                        batch.push(getInfo(pkg, nodeCommand, BOWERPATH, pkgInfo));
                    });

                    batch.end();

                    deferred.resolve(pkgInfo);
                }); // list
            }); // command
        }); // node

        results.push(deferred.promise());
        return results;
    }

    /**
     * Gets information about a package from Bower using the info command
     * @param  {[type]}   pkg         [description]
     * @param  {[type]}   nodeCommand [description]
     * @param  {[type]}   BOWERPATH   [description]
     * @param  {[type]}   pkgInfo     [description]
     * @return {[type]}               [description]
     */
    function getInfo (pkg, nodeCommand, BOWERPATH, pkgInfo) {
        var url = pkg.url,
            info = nodeCommand.execute(PATH, BOWERPATH + '/bower', ['-j', 'info', url.replace(/git:\/\//, 'https://')]), // get through proxies and such
            pkgDeferred = $.Deferred();

        info.fail(function (err) {
            console.error('Could not list bower packages', err);
        });
        info.done(function (stdout) {
            var details = JSON.parse(stdout);

            //id, manager, primary, secondary, link, data1, data2, data3, status
            var id        = details.latest.name,
                primary   = details.latest.name,
                secondary = details.latest.description || '',
                link      = details.latest.homepage,
                data1     = 'Version ' + (details.latest.version || 'Unknown'),
                data2     = 'License ' + (details.latest.license || 'Unknown'),
                data3     = '<div class="bower"></div>',
                status    = '',
                button   = '';

            pkgDeferred.resolve(new Result(id, MANAGER, primary, secondary, link, data1, data2, data3, status, button));
        }); // info

        pkgInfo.push(pkgDeferred.promise());
    }

    /**
     * Lists installed packages/dependencies
     * @memberof bower
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
                showModal(err);
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
                    showModal(err);
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
     * @memberof bower
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
     * @memberof bower
     * @param  {String} packageName A unique name of a package/dependency
     * @return {String}             README URL of package/dependency
     */
    function getReadme (packageName) {

    }

    /**
     * Gets the URL of a package/dependency
     * @memberof bower
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
                showModal(err);
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
                    showModal(err);
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

    function showModal (err) {
        var errorText = {"ERROR_TITLE" : MANAGER + " error" , "ERROR_MESSAGE" : err},
            text = _.merge(errorText, Strings),
            errorModal = Mustache.render(errorTemplate, text);
        Dialogs.showModalDialogUsingTemplate(errorModal);
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
