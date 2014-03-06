# Brackets Cardboard

Manage your project's packages or dependencies (depending on the tool) from within Brackets.

Cardboard? What do most packages arrive in? A cardboard box. Your packages are arriving in this extension, thus it is called cardboard.

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
* Load new managers dynamically

## Contributing

Yes, please. See the TODO list and [CONTRIBUTING](CONTRIBUTING.MD).

## Load a new manager

** Current way to load a new manager is to edit the `modules/Interface.js` file. To have it included with the extension send a PR.

** I want to get to this. Currently this doesn't work.**

Open the `managers` folder in this extension fodler and add the file. The easist way to get to the folder is to select `Help->Show Extensions Folder`.

brackets-cardboard loads all the managers in the `modules/managers` extension folder.

## License
[Apache 2.0](LICENSE)

## On Creation
I used brackets...
Also used code from the Brackets-Extension-toolkit, brackets-git, brackets-todo, and Raymond Camden's article on CodeTuts+


