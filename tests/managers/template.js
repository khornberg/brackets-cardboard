/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

/**
 * Template for modules
 * @module Template
 */

define(function (require, exports, module) {
    'use strict';

    // Dependencies
    var Result            = require("modules/Result"),
        Status            = require("modules/Status"),
        MANAGER           = "template.js"; //same as your file name

    /**
     * Install command
     * @param  {String} packageName A unique name of a package/dependency to install
     * @return {Status}             Status object
     */
    function install (packageName) {

    }

    /**
     * Uninstall command
     * @param  {String} packageName A unique name of a package/dependency to uninstall
     * @return {Status}             Status object
     */
    function uninstall (packageName) {

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

    }

    /**
     * Lists installed packages/dependencies
     * @return {Array} Array of Result objects
     */
    function getInstalled () {

    }

    // Helper methods

    /**
     * Determines if the manager is available/reachable from brackets-cardboard
     * @return {Object} Object with keys of manager and displayAs
     */
    function isAvailable () {
        return {
            "manager" : MANAGER,
            "displayAs" : ""
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
