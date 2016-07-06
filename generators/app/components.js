const fs        = require('fs');
const path      = require('path');
const prompts   = require('./prompts');


const Components = {
  prompts: {
    componentName: [
      {
        type: 'input',
        name: 'componentName',
        message: 'Write Component name:'
      }
    ],

    areStylesNeeded: [
      {
        type: 'confirm',
        name: 'areStylesNeeded',
        message: 'Do you need Styles?'
      }
    ]
  },
  
  questions: function askComponent() {
    const self = this;

    return self.prompt(Components.prompts.componentName)
      .then(function ({ componentName }) {
        const componentsPath        = self.config.get('componentsPath');
        const capitilizedName       = componentName.charAt(0).toUpperCase() + componentName.slice(1);
        const componentFolderPath   = path.join(componentsPath, capitilizedName);

        return new Promise(function (resolve) {
          fs.access(self.destinationPath(componentFolderPath), function (err) {
            if (!err) {
              console.log('This Component already exist');
              resolve(askComponent());
            } else {
              resolve(
                self.prompt(Components.prompts.areStylesNeeded)
                  .then(function({ areStylesNeeded }) {
                    self.props.answers = {
                      creation: 'Component',
                      name: componentName,
                      styles: areStylesNeeded
                    };
                  })
              );
            }
          });
        });
      });
  }
};

module.exports = Components;
