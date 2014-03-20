/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

/**
 * Node.js
 * Creates a node connection for a manager
 * @returns {jQuery Deferred} Deferred execute function
 */

define(function (require, exports, module) {
    'use strict';

    var NodeConnection = brackets.getModule("utils/NodeConnection"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),

        moduleDirectory  = ExtensionUtils.getModulePath(module),
        domainModulePath = moduleDirectory + "domain",
        nodeConnection   = new NodeConnection(),
        nodeDeferred     = new $.Deferred();

        // Connects to Node
        nodeConnection.connect(true).fail(function (err) {
            console.log(err, "Failed to connect to Node.js, extension requires Node.js to be installed");
        }).then(function () {
            // Register the domain.
            return nodeConnection.loadDomains([domainModulePath], true).fail(function (err) {
                console.log(err, "Failed to register Node.js domain, extension requires Node.js to be installed");
            });
        }).then(function () {
            nodeDeferred.resolve(nodeConnection.domains["brackets-cardboard"]);
        }).done();

        return nodeDeferred.promise();
});
