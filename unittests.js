/* global define, describe, it, expect, jasmine */


define( function( require, exports, module ) {
    'use strict';

    // Modules
    var ExtensionUtils    = brackets.getModule("utils/ExtensionUtils"),
        FileSystem        = brackets.getModule("filesystem/FileSystem"),
        _                 = brackets.getModule("thirdparty/lodash"),

        // Setup Extension
        moduleDirectory   = ExtensionUtils.getModulePath(module),
        managerDirectory  = moduleDirectory + "modules/managers",

        // Extension modules
        Interface      = require("modules/Interface"),
        Strings        = require("strings"),
        Result         = require("modules/Result"),
        Status         = require("modules/Status"),
        deferredReduce = require("modules/deferredReduce"),
        isUri          = require("modules/isUri");

    describe("Cardboard", function () {

        describe("init test", function() {

        });

        describe("Interface", function () {
            describe("getManagers", function () {
                it("should return an array of available managers", function () {
                    var managers = Interface.getManagers();
                    expect(managers).toContain("bower.js");
                    expect(managers).toContain("npm.js");
                });
            });

        });

        describe("isUri", function() {
            describe("github", function() {
                it("should recognize username and repos", function() {
                    expect(isUri('khornberg/brackets-cardboard')).toBe(true);
                    expect(isUri('khornberg-01/khorn-berg.github.io')).toBe(true);
                });
            });
        });

  });

/**
 * test each function in main.js
 * is there away to test the UI?
 *
 * test each function in the Interface module
 * 
 */

// Tests in lieu of unittest not working-----------------------
    // isUri tests
    // github user and repo
//    console.debug("isUri test", isUri('khornberg/brackets-cardboard')); //true
//    console.debug("isUri test", isUri('khornberg-01/khorn-berg.github.io')); //true
//    // git git+ssh, git+http, git+https
//    //           .git at the end (probably ssh shorthand)
//    //           git@ at the start
//    console.debug("isUri test", isUri('git://repo')); //true
//    console.debug("isUri test", isUri('git+ssh://repo')); //true
//    console.debug("isUri test", isUri('git+http://repo')); //true
//    console.debug("isUri test", isUri('git+https://repoSecure')); //true
//    console.debug("isUri test", isUri('securerepo.git')); // true
//    console.debug("isUri test", isUri('git@github.com')); //true
//    // SVN case: svn, svn+ssh, svn+http, svn+https, svn+file
//    console.debug("isUri test", isUri('svn://repos')); //true
//    console.debug("isUri test", isUri('svn+ssh://repos')); //true
//    console.debug("isUri test", isUri('svn+http://repos')); //true
//    console.debug("isUri test", isUri('svn+https://repos')); //true
//    console.debug("isUri test", isUri('svn+file://repos')); //true
//    // URL case
//    console.debug("isUri test", isUri('http://some.url.dev')); //true
//    console.debug("isUri test", isUri('https://some.url.dev')); //true
//    // Path case: ./, ../, ~/
//    console.debug("isUri test", isUri('./code/from/here')); //true
//    console.debug("isUri test", isUri('../code/from/here')); //true
//    console.debug("isUri test", isUri('~/code/from/here')); //true
//    

    //Deferred returns
    // waitForIt(Interface.getAvailable(), "getAvailable");
    //var i = Interface.install(m[0], "Package 1");

    // waitForIt(Interface.install(m[0], "bible.math"), "install");
    // wait(Interface.uninstall(m[0], "package :( "), "uninstall");
    // wait(Interface.update(m[0], "package ..."), "update");
    // waitForIt(Interface.search(m[1], "PKG"), "seach single");
    // waitForIt(Interface.search("PKG"), "search all");
    // waitForIt3(Interface.getInstalled(m[2]), "getInstalled single template");
    // waitForIt(Interface.getInstalled(), "getInstalled all");
    //    testData.openReadme  = Interface.openReadme(testData.getManagers[0], "PACKage");
    // waitForIt3(Interface.getUrl(m[2], "bible.math"), "getUrl");

    function waitForIt (promise, msg) {
        $.when.apply($, promise).done(function () {
                var e = arguments;
                console.log(msg + " promise:", e);
            });
    }

    function waitForIt2 (promise, msg) {

        $.when.apply($, promise).done(function () {
                var e = arguments;

                e[0][0].then(function (zz) {
                    console.log('mhhah', zz);
                    var results = [];
                    zz.forEach(function (obj, index, arr) {

                        obj.done(function (zzz) {
                            console.log('all done obj', zzz);
                            results.push(zzz);
                            // SHOULD BE ADD RESULT ROW
                            if (index === arr.length - 1) {
                                var r = { "results" : results };
                                addResults(r, ".brackets-cardboard-table");
                            }
                        });
                    });

                    $.when(zz).done(function () { console.log('when done'); });
                }).done(function () { console.log("done"); });
                console.log(msg + " promise:", e);

            });
    }

    // to use apply all promises must be in an array
    function waitForIt3 (promiseArray, msg) {

        var results = [],
            promises = (_.isArray(promiseArray)) ? promiseArray : [promiseArray];

        $.when.apply($, promises).done(function () {
            var args = Array.prototype.slice.call(arguments);

            args.forEach(function (value) {
                if (value instanceof Result || _.isString(value)) {
                    results.push(value);
                }

                if ((_.isArray(value) || _.isPlainObject(value)) && !_.isArguments(value)) {
                    waitForIt3(value, "recursivly");
                }
            });
            console.debug(results, msg);

            if (results.length > 0 && _.isString(results[0])) {
                console.log("results has items");
                var NativeApp = brackets.getModule("utils/NativeApp");
                NativeApp.openURLInDefaultBrowser(results[0].replace("git://", "http://"));
            }
        });
    }

    function wait (promise, msg) {
        $.when(promise).then(function (data) {
                console.log(data, msg);
                return data;
            });
    }
// --------------------------------------------------------------


});

// sdg
