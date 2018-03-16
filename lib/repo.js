const _           = require('lodash');
const git         = require('simple-git')();
const CLI         = require('clui')
const Spinner     = CLI.Spinner;
const chalk       = require('chalk');
const inquirer    = require('./inquirer');
const fs          = require('fs-extra');

const extract = async (seed, err) => {
    if (err) {
        console.log(chalk.red('Git error : ' + "\n" + err));
    }
    if (seed.folder !== "") {
        await fs.copy('./'+seed.project+'/'+seed.folder, "./");
        await fs.remove('./'+seed.project);
    }
};

module.exports = {
    clone: async (seed) => {
        try {
            await git.clone(seed.value, err => extract(seed, err));
            return true;
        } catch(err) {
            if (err) {
                console.log(chalk.red('Git error : ' + "\n" + err));
            }
        } 
    }
}