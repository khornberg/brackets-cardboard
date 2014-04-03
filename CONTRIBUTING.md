# Contirbuting

[Follow the brackets style](https://github.com/adobe/brackets/wiki/Brackets-Coding-Conventions). They are not my favorite but that's the app you are developing for so try to follow them.

## Developing a Manager

If you know of a manager you want access to, you can follow the template in `tests/managers/template.js` or one in the `modules/managers` folder.

### Documentation
See [the docs](http://khornberg.github.io/brackets-cardboard) for help and instruction. You can also make an issue.  
To update the docs, checkout the master and modify as needed. Then run `npm install` and `grunt jsdoc`. You can check the results by opening `docs/index.html`.

## Cardboard Structure

Primarily, this project provides an interface (a loose OOP sense of the word) for managers and a view (the UI). A manager can be anything accessible by nodejs on the command line (e.g. npm, composer, gem, apt-get, etc.).

In other words, you can add "classes" that use the "interface". The rest of the project displays the data.

Cardboard uses a MV\* architecture where \* is unknown at this time.

`main.js` handles the setup, is the "view" and handles the user interaction  
`strings.js` localization  
`modules/Interface.js` is the interface used by each manager; each manager is a "model"  
`modules/domain.js` connects to node  
`modules/Node.js` gives access to node for each manager  
`modules/Results.js` Result object that represents each package or dependency  
`modules/Status.js` Status object that represents a status  
`html/` html templates  
`css/` css  
`fonts/` fonts  
`nls/` localization strings  
`tests/` unit tests  

Built in Managers

`managers/bowerManager.js` manager for bower  
`managers/npmManager.js` manager for npm  


## Word Diagram of How This Works

The `view` sends a command to the `interface`. The `interface` routes it to the correct `manager(s)`. Each `manager` executes the command for its `source`.

The `source` returns data to the `manager`. The `manager` formats the data and returns them to the `interface`. The `interface` returns the data the `view` for display.
