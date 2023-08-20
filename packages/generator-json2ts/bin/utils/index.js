const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const semver = require('semver');

const NODE_VERSION = 'v16.19.1';

/**
 * Check whether the file exists
 * @param {string} filePath file path
 * @returns {boolean} Whether the file exists
 */
function checkFileExists(filePath) {
    return fs.existsSync(filePath);
}

/**
 * Read the json file and return the result
 * @param {string} filePath file path
 * @returns {{success: 0 | 1; err?: Error; data?: any}} The result of reading the file
 */
function readJsonFile(filePath) {
    const result = {
        success: 1
    };

    try {
        const fileData = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(fileData);
        result.data = jsonData;
    } catch (error) {
        result.success = 0;
        result.error = error;
    }
    return result;
}

/**
 * Request url to get json data
 * @param {string} url The json data source link
 * @param {'GET' | 'POST'} method Request method
 * @param {JSON} data The data carried by the post request
 * @returns {JSON} JSON Object
 */
function getJSONFromURL(url, method, data) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return new Promise((resolve, reject) => {
        const req = http.request(url, options, (response) => {
            let responseData = '';

            response.on('data', (chunk) => {
                responseData += chunk;
            });

            response.on('end', () => {
                try {
                    const json = JSON.parse(responseData);
                    resolve(json);
                } catch (error) {
                    reject(`The data returned in response is not a JSON object`);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (method === 'POST' && data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

/**
 * Write the json file and return the result
 * @param {string} filePath file path
 * @param {any} data JSON Object
 * @returns {{success: 0 | 1; err?: Error}} The result of writing the file
 */
function writeJsonFile(filePath, data) {
    const result = {
        success: 1
    };
    try {
        fs.writeFileSync(filePath, data);
    } catch (error) {
        result.success = 0;
        result.error = error;
    }
    return result;
}

/**
 * Check whether the string conforms to the identifier naming convention
 * @param {string} str The character string to be checked
 * @returns {boolean} Whether the string conforms to the identifier naming convention
 */
function isValidIdentifier(str) {
    const regex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
    return regex.test(str);
}

/**
 * Check if the file path is valid and check if the file suffix is fileSuffix
 * @param {string} filePath file path
 * @param {string} fileSuffix file suffix
 * @returns {boolean}
 */
function isValidFilePath(filePath, fileSuffix) {
    const filePathRegex = /^(?:\.{1,2}\/)?(?:[\w-]+\/)*[\w.-]+\.[\w]+$/;
    if (!filePathRegex.test(filePath)) {
        throw new TypeError(`The path '${filePath}' is not a valid file path`);
    }

    // Checks whether the file suffix is 'json'
    const fileExtension = filePath.split('.').pop();
    if (fileExtension !== fileSuffix) {
        throw new TypeError(`File suffix of path '${filePath}' must be '${fileSuffix}'`);
    }

    return true;
}

/**
 * Set interface names of different styles based on nameStyle
 * @param {string} str The string to be converted
 * @param {'underline' | 'littleHump' | 'bigHump'} nameStyle Style type
 * @returns 
 */
function setInterfaceName(str, nameStyle) {
    let result = '';
    if (nameStyle === 'underline') {
        result += str;
    } else if (nameStyle === 'littleHump') {
        result += str.split('_').map((item, index) => index === 0 ? item.charAt(0).toLowerCase() + item.slice(1) : item.charAt(0).toUpperCase() + item.slice(1)).join('');
    } else if (nameStyle === 'bigHump') {
        result += str.split('_').map(item => item.charAt(0).toUpperCase() + item.slice(1)).join('');
    } else {
        throw new TypeError(`The nameStyle value was expected to be one of 'underline', 'littleHump', or 'bigHump', but it got '${nameStyle}'`);
    }
    return result;
}

/**
 * Verify the updates of different configuration items
 */
const updateStrategy = {
    isForceOverwrite: value => {
        if (!['0', '1'].includes(value)) {
            throw new TypeError(`The isForceOverwrite allows only '0' or '1', but gets '${value}'`);
        }
        return parseInt(value);
    },
    defaultInterfaceName: value => isValidIdentifier(value) ? value : new TypeError(`The defaultInterfaceName ('${value}') is an illegal identifier`),
    nameStyle: value => {
        if (!['underline', 'littleHump', 'bigHump'].includes(value)) {
            throw new TypeError(`The nameStyle allows only 'underline', 'littleHump' or 'bigHump', but gets '${value}'`);
        }
        return value;
    },
    prefix: value => isValidIdentifier(value) ? value : new TypeError(`The prefix ('${value}') is an illegal identifier`),
    defaultInputPath: value => isValidFilePath(value, 'json') && value,
    defaultOutputPath: value => isValidFilePath(value, 'ts') && value,
}

/**
 * Update configuration
 * @param newConfig New configuration
 */
function updateConfig(newConfig) {
    const result = readJsonFile(path.join(__dirname, '../config.json'));
    if (result.success === 1) {
        const { data } = result;
        for (let key in newConfig) {
            if (newConfig.hasOwnProperty(key) && newConfig[key] && data.hasOwnProperty(key)) {
                data[key] = updateStrategy[key](newConfig[key]);
            }
        }
        const { success, error } = writeJsonFile(path.join(__dirname, '../config.json'), JSON.stringify(data));
        if (success === 1) {
            console.log(`Configuration file has been updated in '${path.join(__dirname, '../config.json')}'`);
        } else {
            throw error;
        }
    } else {
        throw result.error;
    }
}

/**
 * Check whether the Node version meets requirements
 */
function CheckNodeVersion() {
    const currentVersion = process.version;
    if (semver.lt(currentVersion, NODE_VERSION)) {
        console.log('\x1b[33m%s\x1b[0m', `Your Node.js version (${currentVersion}) is lower than the required version (${NODE_VERSION}).`);
        // 执行需要的处理逻辑
    }
}

/**
 * Check whether the package version is the latest version
 * @param {string} packageName package name
 * @param {string} version current version
 * @returns {Promise<{latestVersion: string; isLatest: boolean}>}
 */
function checkLatestVersion(packageName, version) {
    return new Promise((resolve, reject) => {
        const requestOptions = {
            hostname: 'registry.npmjs.org',
            path: `/${packageName}/latest`,
            headers: {
                'User-Agent': 'Node.js'
            }
        };

        https.get(requestOptions, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    const response = JSON.parse(data);
                    const latestVersion = 'v' + response.version;
                    resolve({
                        latestVersion,
                        isLatest: !semver.gt(latestVersion, version)
                    });
                } else {
                    reject(new Error(`Failed to fetch latest version. Status code: ${res.statusCode}`));
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

/**
 * Check related versions
 * @param {string} packageName package name
 * @param {string} version current version
 * @returns {void}
 */
async function checkRelatedVersions(packageName, version) {
    await CheckNodeVersion();

    try {
        const result = await checkLatestVersion(packageName, version);

        if (result.isLatest) {
            console.log('This is the latest version.');
        } else {
            console.log('\x1b[33m%s\x1b[0m', `A newer version (${result.latestVersion}) is available.`);
            console.log('\x1b[33m%s\x1b[0m', `Run 'npm install -g ${pkg.name}' to update.`);
        }
    } catch (err) {
        console.error('\x1b[33m%s%s\x1b[0m', 'warn:', err.message);
    }
}

module.exports = {
    checkFileExists,
    readJsonFile,
    getJSONFromURL,
    writeJsonFile,
    isValidIdentifier,
    setInterfaceName,
    isValidFilePath,
    updateConfig,
    CheckNodeVersion,
    checkLatestVersion,
    checkRelatedVersions
}