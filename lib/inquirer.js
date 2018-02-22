const inquirer   = require('inquirer');

module.exports = {

    askSeedWanted: () => {
        const TYPES = [
            {
                value :  "https://github.com/Fairen/seed-models.git",
                name : "TypeScript - Classes and Modules Library Package"
            },
            {
                value :  "https://github.com/Fairen/seed-component.git",
                name : "Angular - Component Module"
            }
        ];
        const questions = [
            {
              type: 'checkbox',
              name: 'seedType',
              message: 'Which seeds would you want ? \n',
              choices: TYPES,
              default: TYPES
            }
        ];
        return inquirer.prompt(questions);
    },
}