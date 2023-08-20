# generator-json2ts

[中文文档](/README.Zh.md)

## Introduction

`generator-json2ts` is a tool for converting JSON into TypeScript type declarations. It helps you automatically generate TypeScript type declaration files to improve TypeScript development efficiency.

## Install

Install `generator-json2ts` by performing the following steps on the command line:

1. Open the terminal or command prompt.
2. Run the following command to install the scaffolding tool:

   ```
   npm install -g generator-json2ts
   // or
   yarn install -g generator-json2ts
   ```

## Instructions for use

`generator-json2ts` provides a simple and powerful command line tool for converting JSON to TypeScript type declaration files. Here are some common usage examples:

### Basic usage

To convert a JSON file to a TypeScript type declaration file, you can use the following command:

```
json2ts convert file -i <filePath>
```

Where, `<filePath>` is the path to the JSON file to be converted. When the conversion is complete, a TypeScript type declaration file named `output.ts` will be generated.

### Advanced usage

`generator-json2ts` also provides a number of optional parameters and options to meet more complex requirements. Here are some common options:
- `-i, --input <filePath>`：specifies the path to the input directory
- `-o, --output <filePath>`：specifies the path to the output directory
- `-f, --force`：if the file already has a forced overwrite
- `-u, --url <url>`：url for requesting data
- `-m, --method <requestMethod>`：request method, currently only support `GET`、`POST`
- `reset config`：reset configuration
    - `isForceOverwrite`：whether to force overwrite files（default: `0`）
    - `defaultInterfaceName`：default root type name（default: `'RootInterface'`）
    - `nameStyle`：type name Naming style: `'underline' | 'littleHump' | 'bigHump'`（default: `'underline'`）
    - `prefix`：type name prefix（default: `''`）
    - `defaultInputPath`：the path of the default input directory（default: `'./input.json'`）
    - `defaultOutputPath`：the path of the default output directory（default: `'./output.ts'`）
- `set config name1=value1 name2=value2 ...`：modify the configuration of the specified option


Here are sample commands that show how to use these options:

```json
// input.json
[{
    "name": "John",
    "age": 25,
    "email": "john@example.com",
    "child": [{
        "name": "John",
        "age": 2
    }, {
        "name": "John",
        "age": 2
    }],
    "hobbies": ["reading", "swimming"],
    "a": null,
    "b": "",
    "c": [null],
    "d": [""],
    "e": [1],
    "f": {
        "name": "hello",
        "age": 2,
        "child": [{
            "name": "hello",
            "age": 2
        }]
    }
}]
```

```json
// config.json
{
    "isForceOverwrite": 0,
    "defaultInterfaceName": "RootInterface",
    "nameStyle": "underline",
    "prefix": "",
    "defaultInputPath": "./input.json",
    "defaultOutputPath": "./output.ts"
}
```
#### json2ts convert file

```
json2ts convert file -f -i ./input.json -o types.ts
```

The results are as follows:

```TypeScript
// ./types.ts
export interface RootInterfaceItem {
    name: string;
    age: number;
    email: string;
    child: RootInterfaceItem_child[];
    hobbies: string[];
    a: null;
    b: string;
    c: null[];
    d: string[];
    e: number[];
    f: RootInterfaceItem_f;
}

export interface RootInterfaceItem_child {
    name: string;
    age: number;
}

export interface RootInterfaceItem_f {
    name: string;
    age: number;
    child: RootInterfaceItem_f_child[];
}

export interface RootInterfaceItem_f_child {
    name: string;
    age: number;
}

export type RootInterface = RootInterfaceItem[];
```

```
json2ts convert file -f -i ./input.json -o types.ts -u http://jsonplaceholder.typicode.com/posts
```

The results are as follows:

```TypeScript
// ./types.ts
export interface RootInterfaceItem {
    userId: number;
    id: number;
    title: string;
    body: string;
}

export type RootInterface = RootInterfaceItem[];
```

#### json2ts set config

```
json2ts set config prefix=I nameStyle=bigHump
```

The results are as follows:

```json
// config.json
{
    "isForceOverwrite": 0,
    "defaultInterfaceName": "RootInterface",
    "nameStyle": "bigHump",
    "prefix": "I",
    "defaultInputPath": "./input.json",
    "defaultOutputPath": "./output.ts"
}
```

```
json2ts convert file -f -i ./input.json -o types.ts
```

The results are as follows:

```TypeScript
// ./types.ts
export interface IRootInterfaceItem {
    name: string;
    age: number;
    email: string;
    child: IRootInterfaceItemChild[];
    hobbies: string[];
    a: null;
    b: string;
    c: null[];
    d: string[];
    e: number[];
    f: IRootInterfaceItemF;
}

export interface IRootInterfaceItemChild {
    name: string;
    age: number;
}

export interface IRootInterfaceItemF {
    name: string;
    age: number;
    child: IRootInterfaceItemFChild[];
}

export interface IRootInterfaceItemFChild {
    name: string;
    age: number;
}

export type IRootInterface = IRootInterfaceItem[];
```

#### json2ts reset config

```
json2ts reset config
```

Next set the default configuration with a series of responses:

```
? Please enter the default interface name： RootName
? Whether to force overwriting if a file already exists Yes
? Please select an identifier naming style littleHump
? Please enter the prefix of the identifier name Pre
? Please enter the default path of the file you want to convert(file suffix must be 'json') ./input.json
? Enter the default path of the converted output file(file suffix must be 'ts') ./output.ts
Configuration file has been updated in '/Users/xxxx/generator-json2ts/packages/generator-json2ts/bin/config.json'
This is the latest version.
```

The results are as follows:

```json
// config.json
{
    "defaultInterfaceName": "RootName",
    "isForceOverwrite": 1,
    "nameStyle": "bigHump",
    "prefix": "Pre",
    "defaultInputPath": "./input.json",
    "defaultOutputPath": "./output.ts"
}
```

```
json2ts convert file -f -i ./input.json -o types.ts
```

The results are as follows:

```TypeScript
// ./types.ts
export interface PreRootNameItem {
    name: string;
    age: number;
    email: string;
    child: PreRootNameItemChild[];
    hobbies: string[];
    a: null;
    b: string;
    c: null[];
    d: string[];
    e: number[];
    f: PreRootNameItemF;
}

export interface PreRootNameItemChild {
    name: string;
    age: number;
}

export interface PreRootNameItemF {
    name: string;
    age: number;
    child: PreRootNameItemFChild[];
}

export interface PreRootNameItemFChild {
    name: string;
    age: number;
}

export type PreRootName = PreRootNameItem[];
```

Hope this tool is helpful to you! If you have any questions or areas for further improvement, please feel free to comment.