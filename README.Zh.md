# generator-json2ts

## 引言

`generator-json2ts` 是一个用于将 JSON 转换为 TypeScript 类型声明的工具。它可以帮助你自动生成 TypeScript 类型声明文件，从而提高 TypeScript 的开发效率。

## 安装

在命令行中执行以下步骤来安装 `generator-json2ts`：

1. 打开终端或命令提示符。
2. 运行以下命令来安装脚手架工具：

   ```
   npm install -g generator-json2ts
   // or
   yarn install -g generator-json2ts
   ```

## 使用说明

`generator-json2ts` 提供了一个简单而强大的命令行工具，用于将 JSON 转换为 TypeScript 类型声明文件。以下是一些常见的用法示例：

### 基本用法

要将一个JSON文件转换为 TypeScript 类型声明文件，可以使用以下命令：

```
json2ts convert file -i <文件路径>
```

其中，`<文件路径>` 是要转换的 JSON 文件的路径。转换完成后，将会生成一个名为 `output.ts` 的 TypeScript 类型声明文件。

### 高级用法

`generator-json2ts` 还提供了一些可选的参数和选项，以满足更复杂的需求。以下是一些常用的选项：
- `-i, --input <目录路径>`：指定输入目录的路径
- `-o, --output <目录路径>`：指定输出目录的路径
- `-f, --force`：如果文件已存在强制覆盖
- `-u, --url <url>`：请求数据的 url
- `-m, --method <请求方法>`：请求方法，目前只支持 `GET`、`POST`
- `reset config`：重置配置
    - `isForceOverwrite`：是否强制覆盖文件（默认：`0`）
    - `defaultInterfaceName`：默认的根类型名（默认：`'RootInterface'`）
    - `nameStyle`：类型名命名风格：`'underline' | 'littleHump' | 'bigHump'`（默认：`'underline'`）
    - `prefix`：类型名前缀（默认：`''`）
    - `defaultInputPath`：默认输入目录的路径（默认：`'./input.json'`）
    - `defaultOutputPath`：默认输出目录的路径（默认：`'./output.ts'`）
- `set config name1=value1 name2=value2 ...`：修改指定选项的配置


以下是示例命令，展示了如何使用这些选项：

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

结果如下：

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

结果如下：

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

结果如下：

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

结果如下：

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

接下来通过一系列回答设置默认配置：

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

结果如下：

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

结果如下：

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

希望这个工具对你有帮助！如果你有任何问题或有可以进一步改进的地方，欢迎随时提意见。