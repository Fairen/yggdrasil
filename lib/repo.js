const _           = require('lodash');
const fs          = require('fs');
const git         = require('simple-git')();
const CLI         = require('clui')
const Spinner     = CLI.Spinner;
const chalk       = require('chalk');
const inquirer    = require('./inquirer');


module.exports = {
    clone: async (seed) => {
        try {
            await git.clone(seed.value, err => {
                if (err) {
                    console.log(chalk.red('Git error : ' + "\n" + err));
                }
            });
            return true;
        } catch(err) {
            // throw err;
        } 
    }
}