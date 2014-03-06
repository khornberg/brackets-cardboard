/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

/*
    Status.js
*/

define(function (require, exports, module) {
    'use strict';

    /**
     * @class Status of manager event
     * @param {String} id           Unique package/dependency name
     * @param {String} manager      Manager name as defined in the `Interface/managerModules` array
     * @param {String} status       Any one of the following: installed, updated, uninstalled, error
     * @param {String} errorMessage Error message.
     */
    function Status (id, manager, status) {
        //id, manager, status, message
        this.id         = arguments[0];
        this.manager    = arguments[1];
        this.status      = arguments[2];
        this.message      = arguments[3];
    }

    Status.prototype.id        = '';
    Status.prototype.manager   = '';
    Status.prototype.status     = '';
    Status.prototype.message     = '';

   return Status;
});
