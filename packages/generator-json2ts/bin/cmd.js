const commander = require('commander');
const figlet = require('figlet');
const inquirer = require('inquirer');
const ora = require("ora");
const path = require('path');
const { checkFileExists, readJsonFile, getJSONFromURL, writeJsonFile, isValidIdentifier, isValidFilePath, updateConfig, checkRelatedVersions } = require('./utils');
const generator = require('./convertJsonToInterface');
const config = require('./config.json');
const package = require('../package.json');

const program = new commander.Command();


const { Option } = commander;

program
    .command('convert file')
    .description('Converting JSON data into TypeScript type declarations')
    .option('-f, --force', 'overwrite target directory if it exist')
    .option('-i, --input-path <inputpath>', 'The input path of the json file')
    .option('-o, --output-path <outputpath>', 'The output path of the type file')
    .option('-u, --url <url>', 'The json data source link')
    .option('-m, --method <method>', 'Request method')
    .action(async (name, option, args, _) => {
        // console.log('name:', name, 'options:', option, option.inputPath);
        const inputPath = path.join(process.cwd(), option.inputPath || config.defaultInputPath);
        const url = option.url;
        const method = option.method || 'GET';
        // console.log(process.cwd(), inputPath)
        if (!checkFileExists(inputPath)) {
            throw new Error(`The file on path '${inputPath}' does not exist`);
        }
        const outputPath = path.join(process.cwd(), option.outputPath || config.defaultOutputPath);
        config.defaultOutputPath = outputPath;
        // console.log(process.cwd(), outputPath)

        const isForceOverwrite = args.parent.rawArgs.includes('-f') || config.isForceOverwrite;

        if(checkFileExists(outputPath) && !isForceOverwrite) {
            const answer = await inquirer.prompt([{
                type: "confirm",
                name: "isOverwrite",
                message: `The '${outputPath}' already exists, whether overwrite?`,
            }]);

            if (!answer.isOverwrite) {
                return;
            }
        }

        const spinner = ora();

        if (url) {
            spinner.start(`fetching...`);
            const res = await getJSONFromURL(url, method);
            spinner.start(`converting...`);
            generator(res, config);
            spinner.succeed(`Type declarations have been generated in '${outputPath}'`);
        } else {
            spinner.start(`reading file...`);
            const result = readJsonFile(inputPath);
            spinner.start(`converting...`);
            if (result.success) {
                generator(result.data, config);
                spinner.succeed(`Type declarations have been generated in '${outputPath}'`);
            } else {
                throw result.error;
            }
        }

    });

program
    .command('reset config')
    .description('Reset configuration')
    .action(async () => {

        const answer = await inquirer.prompt([{
            type: "input",
            name: "defaultInterfaceName",
            message: `Please enter the default interface name：`,
            default: "RootInterface",
            validate: val => isValidIdentifier(val)
        }, {
            type: "confirm",
            name: "isForceOverwrite",
            message: `Whether to force overwriting if a file already exists`,
        }, {
            type: "list",
            name: "nameStyle",
            message: `Please select an identifier naming style`,
            choices: ['underline', 'littleHump', 'bigHump']
        }, {
            type: "input",
            name: "prefix",
            message: `Please enter the prefix of the identifier name`,
            default: "",
            validate: val => isValidIdentifier(val)
        }, {
            type: "input",
            name: "defaultInputPath",
            message: `Please enter the default path of the file you want to convert(file suffix must be 'json')`,
            default: "./input.json",
            validate: val => isValidFilePath(val, 'json')

        }, {
            type: "input",
            name: "defaultOutputPath",
            message: `Enter the default path of the converted output file(file suffix must be 'ts')`,
            default: "./output.ts",
            validate: val => isValidFilePath(val, 'ts')
        }]);
        answer.isForceOverwrite = answer.isForceOverwrite ? 1 : 0;

        const jsonString = JSON.stringify(answer);  
        const outputPath = path.join(__dirname, './config.json');
        const result = writeJsonFile(outputPath, jsonString);

        if (result.success) {
            console.log(`Configuration file has been updated in '${outputPath}'`);
        } else {
            throw result.error;
        }
    });

program
    .command('set config')
    .description('Change configuration')
    .action(async (name, _, options) => {
        const newConfig = options.args.reduce((result, cur) => {
            if (cur !== 'config') {
                const [key, value] = cur.split('=');
                result[key] = value;
            }
            return result;
        }, {});
        // console.log(newConfig)
        updateConfig(newConfig);
    });

program
    .addOption(new Option('-f, --force', 'overwrite target directory if it exist'))

program
    .on('--help', () => {
        console.log('\r\n' + figlet.textSync('json2ts', {
            font: 'Train',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 80,
            whitespaceBreak: true
        }));
    });

program.version(package.version);

program.parse(process.argv);

(async () => {

})();

process.on('beforeExit', async () => {
    await checkRelatedVersions(package.name, 'v' + package.version);
    process.exit(0);
})
