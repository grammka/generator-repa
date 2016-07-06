const fs            = require('fs');
const path          = require('path');
const mkdirp        = require('mkdirp');
const Generators    = require('yeoman-generator');
const prompts       = require('./prompts');


module.exports = Generators.Base.extend({
  initializing: function () {
    this.props = {};
  },

  prompting: function () {
    const self    = this;
    const config  = self.config.getAll();
    
    if (!config || !config.componentsPath || !config.actionsPath || !config.reducersPath) {
      console.log('Let\'s configure paths');
    }
    
    return self.prompt(prompts.configPaths(config))
      .then(function (answers) {
        if (answers.componentsPath) self.config.set('componentsPath', answers.componentsPath);
        if (answers.actionsPath)    self.config.set('actionsPath', answers.actionsPath);
        if (answers.reducersPath)   self.config.set('reducersPath', answers.reducersPath);

        if (answers.creation == 'Component') {
          return (function askComponent() {
            return self.prompt([
              {
                type: 'input',
                name: 'componentName',
                message: 'Write Component name:'
              }
            ])
              .then(function ({ componentName }) {
                const componentsPath        = self.config.get('componentsPath');
                const capitilizedName       = componentName.charAt(0).toUpperCase() + componentName.slice(1);
                const componentFolderPath   = path.join(componentsPath, capitilizedName);

                return new Promise((resolve) => {
                  fs.access(self.destinationPath(componentFolderPath), (err) => {
                    if (!err) {
                      console.log('This Component already exist');
                      resolve(askComponent());
                    } else {
                      resolve(
                        self.prompt([
                          {
                            type: 'confirm',
                            name: 'stylesExist',
                            message: 'Do you need Styles?'
                          }
                        ])
                        .then(function ({ stylesExist }) {
                          self.props.answers = {
                            creation: 'Component',
                            name: componentName,
                            styles: stylesExist
                          };
                        })
                      );
                    }
                  });
                });
              });
          })()
        }
        else if (answers.creation == 'Action') {

        }
        else if (answers.creation == 'Reducer') {

        }
      });
  },

  configuring: function() {
    this.config.save();
  },
  
  writing: {
    createFoldersByConfigPaths: function () {
      const self            = this;
      const componentsPath  = this.config.get('componentsPath');
      const actionsPath     = this.config.get('actionsPath');
      const reducersPath    = this.config.get('reducersPath');
      const paths           = [ componentsPath, actionsPath, reducersPath ];

      for (var i = 0; i < paths.length; i++) {
        var path = self.destinationPath(paths[i]);

        if (!this.fs.exists(path)){
          mkdirp(path, function (err) {
            if (err) {
              return console.log(err);
            }
          });
        }
      }
    },

    components: function () {
      const self = this;
      const { answers } = self.props;
      const { creation, name, styles } = answers;
      
      if (creation == 'Component') {
        const componentsPath        = self.config.get('componentsPath');
        const capitilizedName       = name.charAt(0).toUpperCase() + name.slice(1);
        const componentFolderPath   = path.join(componentsPath, capitilizedName);

        self.fs.copyTpl(
          self.templatePath('component.js'),
          self.destinationPath(`${componentFolderPath}/index.js`),
          { name: name }
        );

        if (styles) {
          self.fs.copyTpl(
            self.templatePath('style.css'),
            self.destinationPath(`${componentFolderPath}/style.css`)
          );
        }
      }
    }
  },

  end: function () {
  	console.log('Smth else?');
  }
});
