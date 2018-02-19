const _           = require('lodash');
const fs          = require('fs');
const git         = require('simple-git')();
const CLI         = require('clui')
const Spinner     = CLI.Spinner;
const chalk       = require('chalk');
const inquirer    = require('./inquirer');


module.exports = {
    clone: async (repo) => {
        const status = new Spinner('Retrieving seed...');
        status.start();
        try {
            await git.clone(repo, err => {
                if (err) {
                    console.log(chalk.red('Git error : ' + "\n" + err));
                }
                status.stop();
            });
            return true;
        } catch(err) {
            throw err;
        } finally {
            status.stop();
        }
    }
}