# Brackets Package/Dependency Manager

Manage your project's packages or dependencies (depending on the tool) from within Brackets.

Initially this has the ability to work with npm and bower (seemed like natural choices).

## Screenshots
![Search]()
![List]()
![Install]()
![Delete]()
![Update]()

[Mock Preview]()

## TODO
* Interface
* Tests
* UI
* Bower manager
* NPM manager
* Localization
* Preferences


## Structure

Primarily, this project provides an interface that you can develop a manager for. A manager can be anything accessable by node on the command line (e.g. npm, composer, bundle, gem, pypi, apt-get, etc.), by loading a native node package, or javascript module.

In other words, you can add "classes" that use the "interface". The rest of the projects displays the data.

`main.js` handles the setup
`modules/Interface.js` is the interface used by each manager
`modules/Ui.js` controls the UI and keeps everything looking pretty
`strings.js` localization
`domain.js` ?
`html/` html templates
`less/` less/css and icons
`nls/` localization strings
`tests/` unit tests

brackets-pdm loads all the managers in the `brackets-pdm/managers` extension folder.
`managers/bowerManager.js` manager for bower
`managers/npmManager.js` manager for npm


### Load a new manager
Open the `managers` folder in this extension fodler and add the file. The easist way to get to the folder is to select `Help->Show Extensions Folder`.

**(FOR NOW) Reload brackets with extensions after adding it.**

## Developing a Manager

If you know of a manager you want access to, you can follow the template in `tests/managers/template.js`. That file (for now) serves as the documentation.

## Interface Documentation
(TODO)

## License
[Apache 2.0](LICENSE)

## On Creation
I used brackets...
Also used code from the Brackets-Extension-toolkit, brackets-git, brackets-todo, and Raymond Camden's article on CodeTuts+


