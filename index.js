#!/usr/bin/env node

const chalk       = require('chalk');
const clear       = require('clear');
const figlet      = require('figlet');
const CLI         = require('clui');
const git         = require('simple-git')();
const Spinner     = CLI.Spinner;
const repo        = require('./lib/repo');
const inquirer    = require('./lib/inquirer');
const fs          = require('fs');
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

    const status = new Spinner('Retrieving seed list...');
    status.start();

    let data = await fs.readFileSync('./model/seed-list.json', 'utf8');
    let seeds = JSON.parse(data);
    status.stop();

    let questions = [
        {
            type: 'checkbox',
            name: 'seedType',
            message: 'Which seeds would you want to retrieve ? \n',
            choices: seeds,
            default: seeds
        }
    ];
    const credentials = await inquirer.askSeedWanted(questions);
    if(credentials && credentials.seedType && credentials.seedType.length > 0){

        let seedsSelected = seeds.filter( seed => {
            return credentials.seedType.includes(seed.value);
        });
        const status = new Spinner('Retrieving seeds ... \n');
        status.start();
        for( seed of seedsSelected) {
            await repo.clone(seed);
            console.log(chalk.green("Seed (") + chalk.yellow(seed.name) + chalk.green(") successfuly retrieved."))
        }
        status.stop();
    }else{
        console.log("\n" + chalk.green('See you soon.'));
    }
}

run();