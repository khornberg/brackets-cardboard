/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, Mustache */

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
        WorkspaceManager  = brackets.getModule("view/WorkspaceManager"),
        ExtensionUtils    = brackets.getModule("utils/ExtensionUtils"),
        AppInit           = brackets.getModule("utils/AppInit"),
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
        isUri          = require("modules/isUri"),

        // Extension variables
        COMMAND_ID        = "brackets-cardboard.cardboardTogglePanel",
        $icon             = $( "<a href='#' title='" + Strings.EXTENSION_NAME + "' class='brackets-cardboard-icon'></a>" ),
        panel             = null;

    // Load CSS
    ExtensionUtils.loadStyleSheet(module, "css/brackets-cardboard.css");
    ExtensionUtils.loadStyleSheet(module, "css/font-awesome.min.css");

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
            $(".brackets-cardboard-search input").focus();
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
    function addResults(results) {
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

    function addStatus(status) {
        var template = require("text!html/status.html"),
            templateInstallButton = require("text!html/installButton.html"),
            templateInstalledButtons = require("text!html/installedButtons.html"),
            templateData = _.merge(status, Strings),
            templatePartials = { installButton : templateInstallButton, installedButtons : templateInstalledButtons},
            templateHtml = Mustache.render(template, templateData, templatePartials);

        $(".brackets-cardboard-table tbody").append(templateHtml);
    }

    /**
     * Updates a single result on the cardboard results table
     * @param  {Array} status  Status object
     */
    function updateResult(status) {
        var template,
            templateData = Strings,
            templateHtml,
            $result = $("tr[data-id='" + status.id + "']");

        switch(status.status) {
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
            case "error":
                addError(status, $result);
                return;
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
     * Adds error to the cardboard panel
     * @param {Status} status Status from manager
     * @param {jQuery Object} $result Package row that generated the error
     */
    function addError(status, $result) {
        var template = require("text!html/error.html"),
            templateData = _.merge(status, Strings),
            templateHtml = Mustache.render(template, templateData);

        if($result.length > 0) {
            $result.removeClass();
            $result.addClass('brackets-cardboard-result-error');
            // Add error row
            $($result).after(templateHtml);
        } else {
            $(".brackets-cardboard-table tbody").append(templateHtml);
        }

        //Remove loading class
        $result.find(".btn-loading").removeClass('btn-loading');
    }

    /**
     * Search for a package
     * @param  {event} event jQuery event
     */
    function search(event) {
        var query = $(this).val();
        if(event.which === 13 && query !== "") {
            var manager = $("#brackets-cardboard-managers .dropdown").attr("data-id"),
                uri = isUri(query);

            clearPanel();

            $('.brackets-cardboard-search input').addClass('brackets-cardboard-spinner'); // start spinner

            if (uri && manager !== undefined) {
                install(query, manager);
                return;
            } else if (uri && manager === undefined) {
                $('.brackets-cardboard-search input').removeClass('brackets-cardboard-spinner'); //stop spinner
                return;
            }

            if (manager === undefined) {
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
     * @param  {string} queryUri     Install URI string from search box
     * @param  {string} uriManager   Manager to use to install uri package. From manager list.
     */
    function install(queryUri, uriManager) {
        var uri = (typeof queryUri === "string") ? queryUri : false,
            id =  uri || $(this).parents("tr").attr("data-id"),
            manager = uriManager || $(this).parents("tr").attr("data-manager");

        if (uri) {
            deferredReduce(Interface.install(manager, id), function (status) {
                if (status[0].status === "installed") {
                    status[0].button = "installed";
                }
                addStatus({"statuses": status});
                $('.brackets-cardboard-search input').removeClass('brackets-cardboard-spinner'); //stop spinner
            });
        } else {
            $(this).addClass('btn-loading');
            deferredReduce(Interface.install(manager, id), function (status) {
                updateResult(status[0]);
            });
        }
    }

    /**
     * Update a package
     */
    function update() {
        var id = $(this).parents("tr").attr("data-id"),
            manager = $(this).parents("tr").attr("data-manager");

        deferredReduce(Interface.update(manager, id), function (status) {
            updateResult(status[0]);
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
            updateResult(status[0]);
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

        panel = WorkspaceManager.createBottomPanel(COMMAND_ID, $(panelHtml), 200);

        // Listeners on the panel
        var $cardboardPanel = $("#brackets-cardboard");

        $cardboardPanel
            .on( "click", ".brackets-cardboard-close", function () {
                cardboardTogglePanel(false);
            })
            .on( "click", ".brackets-cardboard-close-error", function () {
                $(this).parents("tr").remove();
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
