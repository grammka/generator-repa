module.exports = {
  configPaths: (config) => [
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
  ]
};
