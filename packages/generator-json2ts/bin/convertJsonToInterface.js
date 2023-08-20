const { Project } = require('ts-morph');

const { isValidIdentifier, setInterfaceName } = require('./utils');


/**
 * Generate TypeScript type declarations from json data and configuration
 * @param {any} jsonData json data
 * @param {any} config configuration
 */
function generator(jsonData, config) {
    const { defaultOutputPath, nameStyle, prefix } = config;
    const project = new Project();
    const sourceFile = project.createSourceFile(defaultOutputPath, '', { overwrite: true });
    
    const convertJsonToInterface = (jsonData, interfaceName) => {
        if (Array.isArray(jsonData)) {
            if (jsonData.length > 0) {
                const arrayItem = jsonData[0];
    
                if (typeof arrayItem === 'object' && arrayItem !== null) {
                    const nestedInterfaceName = `${interfaceName}Item`;
                    convertJsonToInterface(arrayItem, nestedInterfaceName);
    
                    sourceFile.addTypeAlias({
                        name: interfaceName,
                        type: `${nestedInterfaceName}[]`,
                        isExported: true,
                    });
                } else {
                    sourceFile.addTypeAlias({
                        name: interfaceName,
                        type: `${arrayItem !== null ? typeof arrayItem : null}[]`,
                        isExported: true,
                    });           
                }
            } else {
                sourceFile.addTypeAlias({
                    name: interfaceName,
                    type: `any[]`,
                    isExported: true,
                });  
            }
        } else {
            const interfaceDeclaration = sourceFile.addInterface({ name: interfaceName, isExported: true });
    
            for (const key in jsonData) {
                if (jsonData.hasOwnProperty(key)) {
                    const value = jsonData[key];
                    if(!isValidIdentifier(key)) {
                        throw new TypeError(`The '${key}' does not conform to the identifier naming convention`);
                    }
                    if (Array.isArray(value)) {
                        const arrayType = typeof value[0] === 'object' && value[0] !== null ? setInterfaceName(`${interfaceName}_${key}[]`, nameStyle) : `${value[0] !== null ? typeof value[0] : null}[]`;
                        interfaceDeclaration.addProperty({ name: key, type: arrayType });
                        if (typeof value[0] === 'object' && value[0] !== null) {
                            convertJsonToInterface(value[0], setInterfaceName(`${interfaceName}_${key}`, nameStyle));
                        }
                    } else if (typeof value === 'object' && value !== null) {
                        const nestedInterfaceName = setInterfaceName(`${interfaceName}_${key}`, nameStyle);
                        convertJsonToInterface(value, nestedInterfaceName);
                        interfaceDeclaration.addProperty({ name: key, type: nestedInterfaceName });
                    } else {
                        interfaceDeclaration.addProperty({ name: key, type: value !== null ? typeof value : 'null' });
                    }
                }
            }
        }
    
    }

    convertJsonToInterface(jsonData, prefix + config.defaultInterfaceName);
    
    sourceFile.save();

}

module.exports = generator;
