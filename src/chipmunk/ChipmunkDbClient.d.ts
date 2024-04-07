export interface DataRow {
    [key: string]: any;
    datetime: Date;
}
export declare class FilterEntry {
    key: string;
    tags?: string[];
    static create(key: string, tags?: string[]): FilterEntry;
}
export interface CollectionInfo {
    name: string;
    type: string;
    columns: string[];
    domains: string[];
    rows: number;
    indextype: string;
    lastEdit: Date;
}
export declare enum InsertWriteMode {
    APPEND = "append",
    CREATE = "create"
}
export interface DocumentDataInfo {
    directory: string;
    document: string;
    data: any;
    type: string;
}
export interface StorageEntry {
    key: string;
    value: any;
    tags: string[];
    datetime: Date;
    id?: string;
}
export interface StorageDataInfo {
    document: string;
    keys: any;
    rows: number;
    type: string;
}
export declare class ChipmunkDbClient {
    protected host: string;
    protected port: number;
    protected scheme: string;
    constructor(host: string, port?: number);
    getHostPath(): string;
    queryMerge(query: string, joinQueries: string[], domain?: string): Promise<DataRow[]>;
    query(query: string, domain?: string): Promise<DataRow[]>;
    dropColumns(collection: string, columns: string[], domain?: string): Promise<unknown>;
    dropCollection(collection: string): Promise<boolean>;
    getDocument(directory: string, document: string): Promise<DocumentDataInfo>;
    getAllDocuments(directory?: string): Promise<DocumentDataInfo>;
    saveDocument(directory: string, document: string, data: any, type?: string): Promise<DocumentDataInfo>;
    getAllCollections(): Promise<CollectionInfo[]>;
    insertData(collection: string, rows: DataRow[], domain?: string, mode?: InsertWriteMode): Promise<void>;
    getAllStorages(): Promise<StorageDataInfo>;
    hasStorage(name: string): Promise<boolean>;
    getStorageData(s: string): Promise<StorageDataInfo>;
    getStorageFiltered(s: string, filters: FilterEntry[]): Promise<StorageEntry[]>;
}
