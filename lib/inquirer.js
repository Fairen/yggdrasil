const inquirer   = require('inquirer');

module.exports = {

    askSeedWanted: async (questions) => {
        return inquirer.prompt(questions);
    },
}