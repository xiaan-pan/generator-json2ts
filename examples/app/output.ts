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
