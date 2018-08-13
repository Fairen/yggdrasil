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
const low         = require('lowdb');
const FileSync    = require('lowdb/adapters/FileSync');
const { version } = require('./package.json');

const adapter = new FileSync(path.join(__dirname, 'model/seed-list.json'));
const db = low(adapter);

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

const printHelp = () => {
    console.log("Usage yg [seed] [option]");
    console.log("\n");
    console.log("Options: ")
    console.log("-h, --help                  print Yggdrasil help");
    console.log("-i, --import <file.json>    import seeds from file into Yggdrasil");
    console.log("-l, --list                  list all Yggdrasil seeds");
    console.log("-r, --reset                 reset Yggdrasil seeds heuristic");
    console.log("-rm, --remove <repository>  remove seed with matching repository from Yggdrasil list");
    console.log("-v, --version               print Yggdrasil version");
    console.log("\n");
    console.log("Examples:");
    console.log("yg seed-crud-service        // will retrieve seed-crud-service");
    console.log("yg stream                   // will retrieve the most used seed containing 'stream' in its definition");
}

const printSeeds = () => {
    db.get("seeds").value().forEach( seed => {
        console.log(
            `value   :  ${seed.value}\n`+
            `name    :  ${seed.name}\n`+
            `project :  ${seed.project}\n`+
            `folder  :  ${seed.folder}\n`+
            `counter :  ${seed.counter}\n`
        );
    });
}

const resetCounter = () => {
    db.set("seeds",
        db.get("seeds").value().map( seed => {
            seed.counter = 0; 
            return seed;
        })
    ).write();
}

const importSeeds = async (file) => {
    if(file.match(/^(.*).json$/)){
        let seeds = db.get("seeds").value(); 
        
        const statusFile = new Spinner(`Retrieving seeds from file ${file} ...`);
        statusFile.start();
        let data = await fs.readFileSync(file, 'utf8');
        let importSeeds = JSON.parse(data);
        statusFile.stop();

        if(!importSeeds.seeds || importSeeds.seeds.length == 0){
            console.log(chalk.red(`No seeds found in : ${file}`));
        }else{

            importSeeds.seeds = importSeeds.seeds.filter(seed => !seeds.find(s => s.value === seed.value))
            if(!importSeeds.seeds || importSeeds.seeds.length == 0){
                console.log(chalk.red(`Seeds already imported.`));
            }else{
                seeds = seeds.concat(importSeeds.seeds);
                db.set("seeds",seeds).write();
                console.log(chalk.green("Seeds successfuly imported."));
            }
            exit();
        }
    }else{
        console.log(chalk.red(`Only json file are parsed : ${file}`));
    }
}

const removeSeed = (seedRepository) => {
    let seeds = db.get("seeds").value();
    if(seedRepository === "*"){
        db.set("seeds",[]).write();
    }else{
        if(seeds.find(seed => seed.value === seedRepository)){
            db.set("seeds",seeds.filter(seed => seed.value !== seedRepository)).write();
        }else{
            console.log(chalk.red(`Seed entry : ${seedRepository} not found.`));
        }
    }
}

const printVersion = () => {
    console.log(`Yggdrasil version ${version}`);
}

const initDB = () => {
    
    // Set some defaults (required if your JSON file is empty)
    db.defaults({ seeds: [] }).write();
    db.set("seeds",
        db.get("seeds").value().map( seed => {
            if(!seed.counter){
                seed.counter = 0; 
            }
            return seed;
        })
    ).write();
}

const parseArguments = () => {
    if(process.argv.includes("-h") || process.argv.includes("--help")){
        printHelp();
    }
    else if(process.argv.includes("-v") || process.argv.includes("--version")){
        printVersion();
    }else if(process.argv.includes("-r") || process.argv.includes("--reset")){
        resetCounter();
        console.log("Counter reseted.");
        exit();
    }else if(process.argv.includes("-l") || process.argv.includes("--list")){
        printSeeds();
    }else if(process.argv.includes("-i") || process.argv.includes("--import")){
        let index = (process.argv.indexOf("-i") != -1)?process.argv.indexOf("-i"):process.argv.indexOf("--import");
        if(process.argv[index + 1]){
            importSeeds(process.argv[index + 1]);
        }else{
            console.log(chalk.red("Argument missing. \n"));
            printHelp();
        }
    }else if(process.argv.includes("-rm") || process.argv.includes("--remove")){
        let index = (process.argv.indexOf("-rm") != -1)?process.argv.indexOf("-rm"):process.argv.indexOf("--remove");   
        if(process.argv[index + 1]){
            removeSeed(process.argv[index + 1]);
        }else{
            console.log(chalk.red("Argument missing. \n"));
            printHelp();
        }
    }else{ 
        if(process.argv.find(arg => { return arg.startsWith("-")})){
            console.log(chalk.red("Argument not recognised. \n"));
            printHelp();
        }else{

            clear();
            printHeader();
            if(process.argv.length > 2){
                chooseSeedFromArg(process.argv[2]);
            }else{
                chooseSeed();
            }
            exit();
        }
    }
}

const seedMatch = (seed,regex) => {
    return seed.value.match(regex) || seed.name.match(regex) || seed.project.match(regex);
}

const chooseSeedFromArg = (seedRegex) => {
    let seeds = db.get("seeds").value();
    seeds = seeds.sort( (a,b) => {
        if(seedMatch(a,seedRegex) && seedMatch(b,seedRegex)){
            return b.counter - a.counter;
        }else{
            if(seedMatch(a,seedRegex)){
                return -1
            }else if (seedMatch(b,seedRegex)){
                return 1;
            }else{
                return 0;
            }
        }
    });
    let seed = seeds[0];
    retrieveSeed(seed);
}

const retrieveSeed = async (seed) => {

    let seeds = db.get("seeds").value();

    seeds = seeds.map( s => {
        if(s.value === seed.value){
            s.counter++;
        }
        return s;
    });

    const statusSeeds = new Spinner('Retrieving seeds ...');
    statusSeeds.start();
    statusSeeds.message('Retrieving '+chalk.yellow(seed.name)+' ...');
    await repo.clone(seed);
    statusSeeds.stop();
    console.log('\n');
    console.log(chalk.yellow(seed.name) + chalk.green(" successfuly retrieved."));

    db.set("seeds",seeds).write();
}

const chooseSeed = async () => {
    const status = new Spinner('Retrieving seed list...');
    status.start();
    seeds = db.get("seeds").value();
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
        clear();
        printHeader();
        seeds.filter( seed =>  credentials.seedType.includes(seed.value) )
        .forEach(seed => {
            retrieveSeed(seed);
        });
    }
}

const exit = () => {
    console.log("\n" + chalk.green('See you soon.'));
}

const run = async () => {

    initDB();

    parseArguments();

}

run();