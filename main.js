/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, Mustache, _ */

/**
    brackets-cardboard Brackets Cardboard Extension
    Manage packages/dependencies for your project.
    Copyright 2014 Kyle Hornberg
    LICENSE Apache 2.0
*/

define(function (require, exports, module) {
    'use strict';

    // Modules
    var CommandManager    = brackets.getModule("command/CommandManager"),
        Menus             = brackets.getModule("command/Menus"),
        PanelManager      = brackets.getModule("view/PanelManager"),
        ExtensionUtils    = brackets.getModule("utils/ExtensionUtils"),
        AppInit           = brackets.getModule("utils/AppInit"),
        FileSystem        = brackets.getModule("filesystem/FileSystem"),
        _                 = brackets.getModule("thirdparty/lodash"),

        // Setup Extension
        moduleDirectory   = ExtensionUtils.getModulePath(module),
        managerDirectory  = moduleDirectory + "modules/managers",

        // Extension modules
        Interface         = require("modules/Interface"),
        Strings           = require("strings"),
        Result            = require("modules/Result"),
        Status            = require("modules/Status"),

        // Extension variables
        COMMAND_ID        = "brackets-cardboard.cardboardTogglePanel",
        $icon             = $( "<a href='#' title='" + Strings.EXTENSION_NAME + "' class='brackets-cardboard-icon'></a>" ),
        panel             = null;

// Tests in lieu of unittest not working-----------------------
    // isUri tests
    // github user and repo
    console.debug("isUri test", isUri('khornberg/brackets-cardboard')); //true
    console.debug("isUri test", isUri('khornberg-01/khorn-berg.github.io')); //true
    // git git+ssh, git+http, git+https
    //           .git at the end (probably ssh shorthand)
    //           git@ at the start
    console.debug("isUri test", isUri('git://repo')); //true
    console.debug("isUri test", isUri('git+ssh://repo')); //true
    console.debug("isUri test", isUri('git+http://repo')); //true
    console.debug("isUri test", isUri('git+https://repoSecure')); //true
    console.debug("isUri test", isUri('securerepo.git')); // true
    console.debug("isUri test", isUri('git@github.com')); //true
    // SVN case: svn, svn+ssh, svn+http, svn+https, svn+file
    console.debug("isUri test", isUri('svn://repos')); //true
    console.debug("isUri test", isUri('svn+ssh://repos')); //true
    console.debug("isUri test", isUri('svn+http://repos')); //true
    console.debug("isUri test", isUri('svn+https://repos')); //true
    console.debug("isUri test", isUri('svn+file://repos')); //true
    // URL case
    console.debug("isUri test", isUri('http://some.url.dev')); //true
    console.debug("isUri test", isUri('https://some.url.dev')); //true
    // Path case: ./, ../, ~/
    console.debug("isUri test", isUri('./code/from/here')); //true
    console.debug("isUri test", isUri('../code/from/here')); //true
    console.debug("isUri test", isUri('~/code/from/here')); //true
    
    var m = Interface.getManagers();
    console.log("returned managers", m);

    //Deferred returns
    // waitForIt(Interface.getAvailable(), "getAvailable");
    // var i = Interface.install(m[0], "Package 1");

    // wait(i, "install");
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

    // Load CSS
    ExtensionUtils.loadStyleSheet(module, "css/brackets-cardboard.css");
    ExtensionUtils.loadStyleSheet(module, "css/font-awesome.min.css");

    // Utility Methods

    //
    //
    //
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

    // UI Methods

    /**
     * Show the cardboard panel
     */
    function cardboardTogglePanel(toggle) {
        if(panel.isVisible() || toggle) {
            panel.hide();
            $icon.removeClass("active");
            CommandManager.get(COMMAND_ID).setChecked(false);
        }
        else {
            panel.show();
            $icon.addClass("active");
            CommandManager.get(COMMAND_ID).setChecked(true);
        }
    }

    /**
     * Adds available managers to the search list
     */
    function listManagers() {
        $.when.apply($, Interface.getAvailable()).then(function () {
            var args = arguments,
                managers = [];

            for (var i = args.length - 1; i >= 0; i--) {
                managers.push(args[i]);
            }

            var template = require("text!html/managers.html"),
                templateData = _.merge({"available" : managers }, Strings),
                templateHtml = Mustache.render(template, templateData);

            $('#brackets-cardboard-managers').html(templateHtml);
        });
    }

    /**
     * Select a manager
     */
    function selectManager() {
        // Changes the manager dropdown text and makes it look like a select box
        var manager = $(this).attr("data-id"),
            text =  $(this).text();

        // Change text
        $(this).parent().prev().html(text + ' <span class="caret"></span>');
        // Change data-id
        $(this).parent().prev().attr('data-id', manager);
    }

    /**
     * Adds results to the table on the cardboard panel
     * @param  {Object} results     Object with key "results" of array of Results
     * @param  {String} selector    jQuery selector of DOM object to update
     */
    function addResults(results, selector) {
        var template = require("text!html/results.html"),
            templateInstallButton = require("text!html/installButton.html"),
            templateInstalledButtons = require("text!html/installedButtons.html"),
            templateData = _.merge(results, Strings),
            templatePartials = { installButton : templateInstallButton, installedButtons : templateInstalledButtons},
            templateHtml = Mustache.render(template, templateData, templatePartials);
            // $showButton = $('#brackets-cardboard-show');

        $(".brackets-cardboard-table tbody").append(templateHtml);
        // $showButton.html(Strings.HIDE_INSTALLED);
    }

    /**
     * Updates a single result on the cardboard results table
     * @param  {Array} statuses   Array of Status objects
     */
    function updateResult(statuses) {
        var template,
            templateData = Strings,
            templateHtml,
            $result = $("tr[data-id='" + statuses[0].id + "']");

        switch(statuses[0].status) {
            case "installed":
                template = require("text!html/installedButtons.html");
                $result.removeClass();
                $result.addClass('brackets-cardboard-result-installed');
                break;
            case "updated":
                template = require("text!html/installedButtons.html");
                $result.removeClass();
                $result.addClass('brackets-cardboard-result-installed');
                break;
            case "uninstalled":
                template = require("text!html/installButton.html");
                $result.removeClass();
                break;
            default:
                template = require("text!html/installButton.html");
                $result.removeClass();
        }
        templateHtml = Mustache.render(template, templateData);

        // Add button(s)
        $('td:last-child', $result).html(templateHtml);
    }

    /**
     * Search for a package
     * @param  {event} event jQuery event
     */
    function search(event) {
        var query = $(this).val();
        if(event.which === 13 && query !== "") {
            var manager = $("#brackets-cardboard-managers .dropdown").attr("data-id");

            clearPanel();

            $('.brackets-cardboard-search input').addClass('brackets-cardboard-spinner'); // start spinner

            var uriRegEx = /(http|https|git):\/\/\w+/,
                uri = uriRegEx.test(query);
            
            if (uri) {
                   
            }
            
            if (manager === Strings.SEARCH_ALL) {
                deferredReduce(Interface.search(query), function (results) {
                    var obj = { "results" : results };

                    addResults(obj);
                    //TODO stops when first manager resolves
                    $('.brackets-cardboard-search input').removeClass('brackets-cardboard-spinner'); //stop spinner
                });
            } else {
                deferredReduce(Interface.search(manager, query), function (results) {
                    var obj = { "results" : results };

                    addResults(obj);
                    $('.brackets-cardboard-search input').removeClass('brackets-cardboard-spinner'); //stop spinner
                });
            }

        }
    }

    /**
     * Install a package
     */
    function install() {
        var id = $(this).parents("tr").attr("data-id"),
            manager = $(this).parents("tr").attr("data-manager");

        $(this).addClass('btn-loading');

        deferredReduce(Interface.install(manager, id), function (status) {
            updateResult(status);
        });
    }

    /**
     * Update a package
     */
    function update() {
        var id = $(this).parents("tr").attr("data-id"),
            manager = $(this).parents("tr").attr("data-manager");

        deferredReduce(Interface.update(manager, id), function (status) {
            updateResult(status);
        });
    }

    /**
     * Uninstall a package
     */
    function uninstall() {
        var id = $(this).parents("tr").attr("data-id"),
            manager = $(this).parents("tr").attr("data-manager");

        $(this).addClass('btn-loading');

        deferredReduce(Interface.uninstall(manager, id), function (status) {
            updateResult(status);
        });
    }

    /**
     * Shows installed packages
     */
    function show() {
        var $installed = $(".brackets-cardboard-result-installed, .brackets-cardboard-result-update"),
            $showButton = $("#brackets-cardboard-show"),
            rows = ($(".brackets-cardboard-table tr").length > 0) ? true : false;

        // results are present (eg. a search performed)
        if (rows) {
            $installed.toggle();
            // toggle button
            if ($showButton.html() === Strings.HIDE_INSTALLED) {
                $(this).html(Strings.SHOW_INSTALLED);
            } else {
                $(this).html(Strings.HIDE_INSTALLED);
            }
        } else { // show only the installed packages
            deferredReduce(Interface.getInstalled(), function (results) {
                var obj = { "results" : results };

                addResults(obj);
            });
        }
    }

    /**
     * Clears panel
     */
    function clearPanel() {
        $(".brackets-cardboard-table tr").remove();
    }

    /**
     * Adds the cardboard panel to brackets
     */
    function addPanel() {
        var template = require("text!html/panel.html");
        var panelHtml = Mustache.render(template, Strings);

        panel = PanelManager.createBottomPanel(COMMAND_ID, $(panelHtml), 200);

        // Listeners on the panel
        var $cardboardPanel = $("#brackets-cardboard");

        $cardboardPanel
            .on( "click", ".close", function () {
                cardboardTogglePanel(false);
            })
            .on( "click", "#brackets-cardboard-show", show)
            .on( "keydown", ".brackets-cardboard-search input", search)
            .on( "click", ".brackets-cardboard-manager", selectManager)
            .on( "click", ".brackets-cardboard-install", install)
            .on( "click", ".brackets-cardboard-update", update)
            .on( "click", ".brackets-cardboard-uninstall", uninstall)
            .on( "click", ".brackets-cardboard-clear", clearPanel);
    }

    function init () {
        addPanel();
        listManagers();
    }

    // Listener for toolbar icon
    $icon.click(function () {
        CommandManager.execute(COMMAND_ID);
    }).appendTo("#main-toolbar .buttons");

    // View menu
    // TODO remove?
    CommandManager.register(Strings.MENU_NAME, COMMAND_ID, cardboardTogglePanel);
    var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
    menu.addMenuItem(COMMAND_ID);

    AppInit.appReady(function () {
        init();
    });

});
