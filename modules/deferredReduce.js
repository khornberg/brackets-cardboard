/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $*/

define(function (require, exports, module) {
    'use strict';

    // Modules
    var _              = brackets.getModule("thirdparty/lodash"),
    
    // Extension modules
        Result         = require("modules/Result"),
        Status         = require("modules/Status");

    /**
     * Recursively wait on single deferred objects or arrays of deferred objects.
     * @inner  {Array}        results       Eventual values of each promise
     * @param  {Array}        deferredArray Array of deferred objects
     * @param  {Function}     callback      Function which receives the results of the reduce
     */
    function deferredReduce (deferredArray, callback) {

        var results = [],
            deferreds = (_.isArray(deferredArray)) ? deferredArray : [deferredArray];

        $.when.apply($, deferreds).done(function () {
            var args = Array.prototype.slice.call(arguments);

            args.forEach(function (value) {
                if (value instanceof Result || value instanceof Status || _.isString(value)) {
                    results.push(value);
                }

                if (value.length !== 0 && (_.isArray(value) || _.isPlainObject(value)) && !_.isArguments(value)) {
                    deferredReduce(value, callback);
                }

                if (value.length === 0) {
                    results.push(value);
                }
            });

            if (results.length > 0) {
                console.debug("deferredReduce", results);
                callback(results);
            }
        });
    }

    return deferredReduce;

});