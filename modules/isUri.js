/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define*/

define(function (require, exports, module) {
    'use strict';

    /**    
     * Deterimes if source is a URI.    
     * @param {String} source URI    
     * @returns {Boolean}    
     */
    function isUri(source) {
        // Likely a github user and repo
        // False positive when starting with a dash (-), which Github doesn't allow
        if (/^[\w\-]*\/[\w\-]*/i.test(source)) {
            return true;
        }
        
        // Git case: git git+ssh, git+http, git+https
        //           .git at the end (probably ssh shorthand)
        //           git@ at the start
        if (/^git(\+(ssh|https?))?:\/\//i.test(source) || /\.git\/?$/i.test(source) || /^git@/i.test(source)) {
            return true;
        }

        // SVN case: svn, svn+ssh, svn+http, svn+https, svn+file
        if (/^svn(\+(ssh|https?|file))?:\/\//i.test(source)) {
            return true;
        }

        // URL case
        if (/^https?:\/\//i.test(source)) {
            return true;
        }
        
        // Path case: ./, ../, ~/
        if (/^\.\.?[\/\\]/.test(source) || /^~\//.test(source)) {
            return true;
        }
            
        return false;
    }

    return isUri;
});