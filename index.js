#!/usr/bin/env node

const chalk       = require('chalk');
const clear       = require('clear');
const figlet      = require('figlet');
const CLI         = require('clui');
const git         = require('simple-git')();
const Spinner     = CLI.Spinner;
const repo        = require('./lib/repo');
const inquirer    = require('./lib/inquirer');
clear();

console.log(
    chalk.green(
"      # #### ####" + "\n" + 
"    ### \/#|### |/####" + "\n" + 
"   ##\/#/ \||/##/_/##/_#" + "\n" + 
" ###  \/###|/ \/ # ###" + "\n" + 
"##_\_#\_\## | #/###_/_####" + "\n" + 
"## #### # \ #| /  #### ##/##" + "\n" + 
"__#_--###`  |{,###---###-~" + "\n" + 
"         \ }{" + "\n" + 
"          }}{" + "\n" + 
"          }}{" + "\n" + 
"          {{}" + "\n" + 
"    , -=-~{ .-^- _" + "\n" + 
"          `}" + "\n" + 
"          {"+ "\n" ) +  
  chalk.yellow( 
    figlet.textSync('Yggdrasil', { horizontalLayout: 'full' })
  ) + 
  "\n" 
);

const run = async () => {
    const credentials = await inquirer.askSeedWanted();
    if(credentials && credentials.seedType && credentials.seedType.length > 0){
        let seedType = credentials.seedType[0];
        await repo.clone(seedType);
        console.log(chalk.green("Seed (") + chalk.yellow(seedType) + chalk.green(") successfuly retrieved."))
    }else{
        console.log("\n" + chalk.red('See you soon.'));
    }
}

run();