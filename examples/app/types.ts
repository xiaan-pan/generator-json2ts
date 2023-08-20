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
