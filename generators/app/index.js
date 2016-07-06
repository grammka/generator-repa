const path          = require('path');
const mkdirp        = require('mkdirp');
const Generators    = require('yeoman-generator');


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
    
    return self.prompt([
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
                answers.creation = 'Component';
                self.props.answers = answers;
              });

          case 'Action':
          case 'Reducer':
            break;
        }
      });
  },

  configuring: function() {
    this.config.save();
  },
  
  writing: {
    createFoldersByConfigPaths: function () {
      const componentsPath  = this.config.get('componentsPath');
      const actionsPath     = this.config.get('actionsPath');
      const reducersPath    = this.config.get('reducersPath');
      const paths           = [ componentsPath, actionsPath, reducersPath ];

      for (var i = 0; i < paths.length; i++) {
        var path = this.destinationPath(paths[i]);

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
      const { answers } = this.props;
      const { creation, name, styles } = answers;
      
      if (creation == 'Component') {
        const componentsPath        = this.config.get('componentsPath');
        const capitilizedName       = name.charAt(0).toUpperCase() + name.slice(1);
        const componentFolderPath   = path.join(componentsPath, capitilizedName);

        this.fs.copyTpl(
          this.templatePath('component.js'),
          this.destinationPath(`${componentFolderPath}/index.js`),
          { name: name }
        );

        if (styles) {
          this.fs.copyTpl(
            this.templatePath('style.css'),
            this.destinationPath(`${componentFolderPath}/style.css`)
          );
        }
      }
    }
  },

  end: function () {
  	console.log('Smth else?');
  }
});
