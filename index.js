#!/usr/bin/env node

const chalk       = require('chalk');
const clear       = require('clear');
const figlet      = require('figlet');
const CLI         = require('clui');
const Spinner     = CLI.Spinner;
const repo        = require('./lib/repo');
const inquirer    = require('./lib/inquirer');
const fs          = require('fs');
const path        = require('path');    
clear();

const printHeader = () => {
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
};

printHeader();

const run = async () => {

    const status = new Spinner('Retrieving seed list...');
    status.start();
    let data = await fs.readFileSync(path.join(__dirname, 'model/seed-list.json'), 'utf8');
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

        clear();
        printHeader();
        const statusSeeds = new Spinner('Retrieving seeds ...');
        clear();
        printHeader();
        for( seed of seedsSelected) {
            statusSeeds.start();
            statusSeeds.message('Retrieving '+chalk.yellow(seed.name)+' ...');
            await repo.clone(seed);
            statusSeeds.stop();
            console.log('\n');
            console.log(chalk.yellow(seed.name) + chalk.green(" successfuly retrieved."));
        }
        console.log("\n" + chalk.green('See you soon.'));
    }else{
        console.log("\n" + chalk.green('See you soon.'));
    }
}

run();