const inquirer   = require('inquirer');

module.exports = {

    askSeedWanted: () => {
        const TYPES = [
            {
                value :  "https://github.com/Fairen/seed-models.git",
                name : "TypeScript - Classes and Modules Library Package"
            }
        ];
        const questions = [
            {
              type: 'checkbox',
              name: 'seedType',
              message: 'which seed did you want :',
              choices: TYPES,
              default: TYPES
            }
        ];
        return inquirer.prompt(questions);
    },
}