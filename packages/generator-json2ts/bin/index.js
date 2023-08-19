#! /usr/bin/env node
const { CheckNodeVersion, checkLatestVersion } = require('./utils');
const pkg = require('../package.json');

(async () => {
    CheckNodeVersion();

    await require('./cmd');
    
    
    if (process.argv.length === 2) {
        console.log('\x1b[34m%s\x1b[0m', `Welcome to json-ts-generator, you can run '${json-ts-generator} -h' for detailed usage of given command`);
        process.exit(0);
    }
    
    process.nextTick(async () => {

    })

    
    
})();

