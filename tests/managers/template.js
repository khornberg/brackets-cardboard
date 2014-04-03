/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

/**
 * Template for managers
 * @class Template
 * @classdesc Template for managers to follow. Since you are working with nodejs
 * and most things are asyncronous, return a jQuery deferred (ES6 promises will come when the Chrome
 * version is updated in brackets). Remember to resolve your deferred. Either resolve a single
 * object or an array of objects.  
 *
 * Take a look at the bower class for examples of this.
 *
 * To use Node, each command must be wrapped in a done function
 *
 *     Node.done(function(nodeComamnd) {
 *          var ls = nodeComamnd(dir._path, 'ls', ['-l', '-a']);
 *          ls.fail(function (err) {
 *              console.log('command failed', err);
 *          });
 *          ls.done(function (stdout) {
 *              console.log(stdout);
 *          });
 *       });
 *
 * @see  domain
 * @see  bower
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
        MANAGER          = "template.js", //same as your file name
        NAME             = "Template"; //display name

    Node.fail(function (err){
        console.error('Error with Node', err);
    });

    /**
     * Install command
     * @memberof Template
     * @param  {String} packageName A unique name of a package/dependency to install
     * @return {Status}             Status object
     */
    function install (packageName) {

    }

    /**
     * Uninstall command
     * @memberof Template
     * @param  {String} packageName A unique name of a package/dependency to uninstall
     * @return {Status}             Status object
     */
    function uninstall (packageName) {

    }

    /**
     * Update command
     * @memberof Template
     * @param  {String} packageName A unique name of a package/dependency to update
     * @return {Status}             Status object
     */
    function update (packageName) {

    }

    /**
     * Search for package/dependency
     * @memberof Template
     * @param  {String} query Search query
     * @return {Array}        Array of Result objects
     */
    function search (query) {

    }

    /**
     * Lists installed packages/dependencies
     * @memberof Template
     * @return {Array} Array of Result objects
     */
    function getInstalled () {

    }

    // Helper methods

    /**
     * Determines if the manager is available/reachable from brackets-cardboard
     * @memberof Template
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
     * @memberof Template
     * @param  {String} packageName A unique name of a package/dependency
     * @return {String}             README URL of package/dependency
     */
    function getReadme (packageName) {

    }

    /**
     * Gets the URL of a package/dependency
     * @memberof Template
     * @param  {String} packageName A unique name of a package/dependency
     * @return {String}             URL of package/dependency
     */
    function getUrl (packageName) {

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
