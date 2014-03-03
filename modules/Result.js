/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

/*
    Result.js
    Result object. Managers return arrays of these.
*/
 
define(function (require, exports, module) {
    'use strict';

    function Result (id, manager, primary, secondary, link, data1, data2, data3) {
        this.id         = id;
        this.manager    = manager;
        this.primary    = primary;
        this.secondary  = secondary;
        this.link       = link;
        this.data1      = data1;
        this.data2      = data2;
        this.data3      = data3;
    }
    
    Result.prototype.id        = '';
    Result.prototype.manager   = '';
    Result.prototype.primary   = '';
    Result.prototype.secondary = '';
    Result.prototype.link      = '';
    Result.prototype.data1     = '';
    Result.prototype.data2     = '';
    Result.prototype.data3     = '';
    
   return Result;
});