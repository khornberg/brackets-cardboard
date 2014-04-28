/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, Mustache */

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
        Dialogs        = brackets.getModule("widgets/Dialogs"),
        _              = brackets.getModule("thirdparty/lodash"),

        Strings          = require("strings"),
        projectDirectory = ProjectManager.getProjectRoot(),
        errorTemplate    = require("text!html/errorModal.html"),
        Node             = require("modules/Node"),
        Result           = require("modules/Result"),
        Status           = require("modules/Status"),
        DOMAIN           = "brackets-cardboard",
        PATH             = projectDirectory._path,
        MANAGER          = "npm.js", //same as your file name
        NAME             = "npm", // display name
        SEARCH_URL       = "https://www.npmjs.org/";

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
        // npm install

        var deferred = $.Deferred();

        Node.done(function(nodeCommand) {

            var command = nodeCommand.execute(PATH, 'npm', ['install', packageName, '--json']);

            command.fail(function (err) {
                console.error('Could not install' + packageName + 'from npm', err);
                // Return error message
                showModal(err);
            });
            command.done(function (stdout){
                var response = JSON.parse(stdout);

                if ($.isEmptyObject(response)) {
                    console.log(packageName, "already installed");
                } else {
                    var status = new Status(response[0].name, MANAGER, "installed");
                    deferred.resolve(status);
                }
            }); // command
        }); // node

        return deferred.promise();
    }

    /**
     * Uninstall command
     * @memberof npm
     * @param  {String} packageName A unique name of a package/dependency to uninstall
     * @return {Status}             Status object
     */
    function uninstall (packageName) {
        // npm uninstall

        var deferred = $.Deferred();

        Node.done(function(nodeCommand) {
            var command = nodeCommand.execute(PATH, 'npm', ['uninstall', packageName, '--json']);

            command.fail(function (err) {
                console.error('Could not uninstall' + packageName + 'from npm', err);
                // Return error message
                showModal(err);
            });
            command.done(function (stdout){
                var response = stdout.match(/unbuild/);

                if (!response) {
                    console.log(packageName, "not installed");
                } else {
                    var status = new Status(packageName, MANAGER, "uninstalled");
                    deferred.resolve(status);
                }
            }); // command
        }); // node

        return deferred.promise();
    }

    /**
     * Update command
     * @memberof npm
     * @param  {String} packageName A unique name of a package/dependency to update
     * @return {Status}             Status object
     */
    function update (packageName) {
        
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
                showModal(err);
            });
            command.done(function (stdout) {
                console.debug(stdout);
                var details = stdout.split('\n').slice(1);

                if (details.length === 0) {
                    console.log('no npm results');
                    pkgInfo.push(new Result('', MANAGER, 'No results found for ' + query, '', SEARCH_URL, '', '', '', 'update', 'none'));
                    deferred.resolve(pkgInfo);
                    return;
                }

                details.forEach(function(line) {
                    var name     = line.match(/^[\w-]+/)[0],
                        desc     = line.match(/\s.*/)[0].split('=')[0].trim(),
                        authors  = line.match(/=\w*/g).join(', ').replace(/=/g, ''),
                        date     = line.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/)[0],
                        version  = (line.match(/\d*\.\d*\.\d*(-|\.|\w|\d)*/)) ? line.match(/\d*\.\d*\.\d*(-|\.|\w|\d)*/)[0] : '',
                        keywords = (line.match(/\d*\.\d*\.\d*(-|\.|\w|\d)*$/)) ? '': line.split(/\d*\.\d*\.\d*(-|\.|\w|\d)*\s/).pop().trim(), //version last on the line?
                        pkg      = [name, desc, authors, date, version, keywords];

                    console.debug('npm search', pkg);
                    // //id, manager, primary, secondary, link, data1, data2, data3, status
                    var id        = name,
                        primary   = name,
                        secondary = desc,
                        link      = '',
                        data1     = 'Version ' + (version || 'Unknown'),
                        data2     = 'Last updated at: ' + date,
                        data3     = keywords,
                        status    = '',
                        button    = '';

                    results.push(new Result(id, MANAGER, primary, secondary, link, data1, data2, data3, status, button));
                }); // forEach

                deferred.resolve(results);
            }); // command
        }); // node

        return deferred.promise();
    }

    /**
     * Lists installed packages/dependencies
     * @memberof npm
     * @return {Array} Array of Result objects
     */
    function getInstalled () {
        // npm list

        var results = [];
        var deferred = $.Deferred();

        Node.done(function(nodeCommand) {

            var command = nodeCommand.execute(PATH, 'npm', ['list', '--json']);

            command.fail(function (err) {
                console.error('Could not get dependencies', err);
                // Return error message
                showModal(err);
            });
            command.done(function (stdout) {
                var list = JSON.parse(stdout),
                    depsArray = [],
                    keys = Object.keys(list.dependencies);
                console.debug(keys);

                keys.forEach(function (pkg) {
                    //id, manager, primary, secondary, link, data1, data2, data3, status
                    var id        = pkg,
                        primary   = '',
                        secondary = '',
                        link      = '',
                        data1     = 'Version ' + (list.dependencies[pkg].version || 'Unknown'),
                        data2     = '',
                        data3     = '',
                        status    = 'installed',
                        button    = 'installed';

                    results.push(new Result(id, MANAGER, primary, secondary, link, data1, data2, data3, status, button));
                });

                deferred.resolve(results);
            }); // command
        }); // node

        return deferred.promise();
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

            var command = nodeCommand.execute(PATH, 'npm', ['info', packageName, '--json']);

            command.fail(function (err) {
                console.error('Could not get npm info for ' + packageName, err);
                // Return error message
                showModal(err);

            });
            command.done(function (stdout) {
                var search = JSON.parse(stdout);
                deferred.resolve(search.homepage);
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
