export interface RootInterface {
    name: string;
    version: string;
    description: string;
    main: string;
    scripts: RootInterface_scripts;
    dependencies: RootInterface_dependencies;
    keywords: undefined[];
    author: string;
    license: string;
}

export interface RootInterface_scripts {
    json2ts: string;
}

export interface RootInterface_dependencies {
    generatorjson2ts: string;
}
