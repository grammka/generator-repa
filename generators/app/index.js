const fs            = require('fs');
const path          = require('path');
const mkdirp        = require('mkdirp');
const Generators    = require('yeoman-generator');
const inquirer      = require('inquirer');

const genComponent  = require('./genComponent');
const genStyle      = require('./genStyle');


function createComponentFolder(name) {
  const folderPath = path.join(this.config.get('componentsPath'), name.charAt(0).toUpperCase() + name.slice(1));

  fs.mkdir(folderPath, function (err) {
    if (err) {
      return console.log(err);
    }
  });

  return folderPath;
}

function createComponent(folderPath, name, styles) {
  const jsPath      = path.join(folderPath, 'index.js');
  const content     = genComponent({
                      componentName: name,
                      isStylesNeeded: styles
                    });

  fs.writeFile(jsPath, content, function (err) {
    if (err) {
      return console.log(err);
    }
  });
}

function createStyles(folderPath) {
  const toPath      = path.join(folderPath, 'style.css');
  const content     = genStyle();

  fs.writeFile(toPath, content, function (err) {
    if (err) {
      return console.log(err);
    }
  });
}

module.exports = Generators.Base.extend({
  config: function() {
    this.config.save();
  },

  prompting: function () {
    const self    = this;
    const config  = self.config.getAll();
    
    if (!config || !config.componentsPath || !config.actionsPath || !config.reducersPath) {
      console.log('Let\'s configure paths');
    }
    
    self.prompt([
      {
        type: 'input',
        name: 'componentsPath',
        message: 'Write Components path:',
        when: function () {
          return !config.componentsPath
        }
      },
      {
        type: 'input',
        name: 'actionsPath',
        message: 'Write Actions path:',
        when: function () {
          return !config.actionsPath
        }
      },
      {
        type: 'input',
        name: 'reducersPath',
        message: 'Write Reducers path:',
        when: function () {
          return !config.reducersPath
        }
      },
      {
        type: 'list',
        name: 'creation',
        message: 'What to create?',
        choices: [
          'Component',
          'Action',
          'Reducer'
        ]
      }
    ])
      .then(function (answers) {
        if (answers.componentsPath) self.config.set('componentsPath', answers.componentsPath);
        if (answers.actionsPath) self.config.set('actionsPath', answers.actionsPath);
        if (answers.reducersPath) self.config.set('reducersPath', answers.reducersPath);
        
        switch (answers.creation) {
          case 'Component':
            return self.prompt([
              {
                type: 'input',
                name: 'name',
                message: 'Write Component name:'
              },
              {
                type: 'confirm',
                name: 'styles',
                message: 'Do you need Styles?'
              }
            ])
              .then(function (answers) {
                const folderPath = createComponentFolder.call(self, answers.name);

                createComponent.call(self, folderPath, answers.name, answers.styles);

                if (answers.styles) {
                  createStyles.call(self, folderPath);
                }
              });

          case 'Action':
          case 'Reducer':
            break;
        }
      });
  }
});
