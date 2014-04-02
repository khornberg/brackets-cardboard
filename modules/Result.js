/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

/*
    Result.js
*/
 
define(function (require, exports, module) {
    'use strict';

    /**
     * Search result
     * @class Result
     * @param {Stinrg} id        Unique package/dependency name
     * @param {String} manager   Manager name as defined in the `Interface/managerModules` array
     * @param {String} primary   Primary text about the result (eg. A friendly name of a package)
     * @param {String} secondary Secondary text about the result (eg. a description of a package)
     * @param {String} link      Url of a package/dependency
     * @param {String} data1     Data field (eg. last updated *)
     * @param {String} data2     Data field (eg. version)
     * @param {String} data3     Data field (eg. downloads)
     * @param {String} status    Status of result; either an empty string, installed, update, or error
     * @param {String} button    Description of buttons; either an empty string or installed
     */
    function Result (id, manager, primary, secondary, link, data1, data2, data3, status, button) {
        this.id         = id;
        this.manager    = manager;
        this.primary    = primary;
        this.secondary  = secondary;
        this.link       = link;
        this.data1      = data1;
        this.data2      = data2;
        this.data3      = data3;
        this.status     = status;
        this.button     = button;
    }
    
    Result.prototype.id        = '';
    Result.prototype.manager   = '';
    Result.prototype.primary   = '';
    Result.prototype.secondary = '';
    Result.prototype.link      = '';
    Result.prototype.data1     = '';
    Result.prototype.data2     = '';
    Result.prototype.data3     = '';
    Result.prototype.status     = '';
    Result.prototype.button     = '';
    
    return Result;
});
