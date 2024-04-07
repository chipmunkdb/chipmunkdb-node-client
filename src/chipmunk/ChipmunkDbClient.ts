import axios, {AxiosError, AxiosResponse} from 'axios';

export interface DataRow {
    [key: string]: any;
    datetime: Date;
}

export class FilterEntry {
    key: string = "";
    tags?: string[];

    static create(key: string, tags?: string[]) {
        const f = new FilterEntry();
        f.key = key;
        if (tags)
            f.tags = tags;
        return f;
    }


}

export interface CollectionInfo {
    name: string;
    type: string;
    columns: string[];
    domains: string[];
    rows: number;
    indextype: string;
    lastEdit: Date,
}

export enum InsertWriteMode {
    APPEND = "append",
    CREATE = "create"
}

export interface DocumentDataInfo {
    directory: string;
    document: string;
    data: any;
    type: string
}

export interface StorageEntry {
    key: string
    value: any
    tags: string[]
    datetime: Date
    id?: string
}

export interface StorageDataInfo {
    document: string;
    keys: any;
    rows: number;
    type: string
}

export class ChipmunkDbClient {
    protected host: string;
    protected port: number;
    protected scheme: string;

    constructor(host: string, port: number = 8091) {
        this.host = host;
        this.port = port;
        this.scheme = "http://";
    }

    getHostPath() {
        return this.scheme+this.host+":"+this.port;
    }

    public queryMerge(query: string, joinQueries: string[], domain?: string) : Promise<DataRow[]> {
        return new Promise((resolve, reject) => {
            let domainstr = "";
            if (typeof domain !== "undefined") {
                domainstr = "&domains="+domain;
            }
            let joins = "";
            joins = "&q="+joinQueries.join("&q=");
            return axios.get(this.getHostPath()+'/query?q='+query+domainstr+joins+"&options=merge_tables")
                .then((response: AxiosResponse) => {
                    // handle success
                    try {
                        if (response.status == 200) {
                            const result = (typeof response.data === "string") ?
                                JSON.parse(response.data.replace(/\bNaN\b/g, "null")).result :
                                response.data.result;
                            return resolve(result);
                        }
                        reject(response.data);
                    }
                    catch (e) {
                        reject(e);
                    }
                })
                .catch((error: AxiosError) => {
                    reject((error.response) ? error.response.data : error);
                });
        })

    }

    public query(query: string, domain?: string) : Promise<DataRow[]> {
        return new Promise((resolve, reject) => {
            let domainstr = "";
            if (typeof domain !== "undefined" && domain != null) {
                domainstr = "&domains="+domain;
            }
            return axios.get(this.getHostPath()+'/query?q='+query+domainstr)
                .then((response: AxiosResponse) => {
                    // handle success
                    try {
                        if (response.status == 200) {
                            const result = (typeof response.data === "string") ?
                                JSON.parse(response.data.replace(/\bNaN\b/g, "null")).result :
                                response.data.result;
                            return resolve(result);
                        }
                        reject(response.data);
                    }
                    catch (e) {
                        reject(e);
                    }
                })
                .catch((error: AxiosError) => {
                    reject((error.response) ? error.response.data : error);
                });
        })

    }

    dropColumns(collection: string, columns: string[], domain?: string) {
        return new Promise((resolve, reject) => {
            return axios.delete(this.getHostPath()+'/collection/'+collection+"/dropColumns", {
                headers: {
                    "x-data": JSON.stringify({
                        "domain": (domain) ? domain : null,
                        "columns": columns.join(",")
                    })
                }
            })
                .then((response: AxiosResponse) => {
                    // handle success
                    if (response.status == 200) {
                        return resolve(response.data.success);
                    }
                    reject(response.data);
                })
                .catch((error: AxiosError) => {
                    reject((error.response) ? error.response.data : error);
                });
        });
    }

    dropCollection(collection: string) : Promise<boolean> {
        return new Promise((resolve, reject) => {
            return axios.post(this.getHostPath()+'/collection/'+collection+"/drop", {
                "collection": collection, "drop": true
            })
                .then((response: AxiosResponse) => {
                    // handle success
                    if (response.status == 200) {
                        return resolve(true);
                    }
                    reject(response.data);
                })
                .catch((error: AxiosError) => {
                    reject((error.response) ? error.response.data : error);
                });
        });
    }

    getDocument(directory: string, document: string) : Promise<DocumentDataInfo> {
        return new Promise<DocumentDataInfo>((resolve, reject) => {
            return axios.get(this.getHostPath()+'/directory/'+directory+"/"+document)
                .then((response: AxiosResponse) => {
                    // handle success
                    if (response.status == 200) {
                        return resolve(response.data);
                    }
                    reject(response.data);
                })
                .catch((error: AxiosError) => {
                    reject((error.response) ? error.response.data : error);
                });
        });
    }

    getAllDocuments(directory: string = "") {
        return new Promise<DocumentDataInfo>((resolve, reject) => {
            let dir = this.getHostPath() + '/directories';
            if (directory != "") {
                dir = this.getHostPath() + "/directory/" + directory
            }
            return axios.get(dir)
                .then((response) => {

                    if (typeof response.data === "string") {
                        response.data = JSON.parse(response.data);
                    }
                    return resolve((typeof response.data.directories !== "undefined") ? response.data.directories : response.data.documents);
                });
        });
    }

    saveDocument(directory: string, document: string, data: any, type: string = "single") : Promise<DocumentDataInfo> {
        return new Promise<DocumentDataInfo>((resolve, reject) => {
            return axios.post(this.getHostPath()+'/directory/'+directory+"/"+document, {
                "data": data, "type": type
            }, {

                maxContentLength: 100000000,
                    maxBodyLength: 1000000000
            })
                .then((response: AxiosResponse) => {
                    // handle success
                    if (response.status == 200) {
                        return resolve(response.data);
                    }
                    reject(response.data);
                })
                .catch((error: AxiosError) => {
                    reject((error.response) ? error.response.data : error);
                });
        });
    }

    getAllCollections() : Promise<CollectionInfo[]> {
        return new Promise((resolve, reject) => {
            return axios.get(this.getHostPath()+'/collections')
                .then((response: AxiosResponse) => {
                    // handle success
                    if (response.status == 200) {
                        if (typeof response.data === "string") {
                            response.data = JSON.parse(response.data);
                        }
                        const cols = response.data.collections.map((c: CollectionInfo) => {

                            try {
                                // @ts-ignore
                                c.columns = JSON.parse(c.columns);
                            }
                            catch (e) {

                            }
                            try {
                                // @ts-ignore
                                c.domains = JSON.parse(c.domains);
                            }
                            catch (e) {

                            }
                            return c;
                        })
                        return resolve(cols);
                    }
                    reject(response.data);
                })
                .catch((error: AxiosError) => {
                    reject((error.response) ? error.response.data : error);
                });
        });
    }

    insertData(collection: string, rows: DataRow[], domain?: string, mode?: InsertWriteMode) : Promise<void> {
        return new Promise((resolve, reject) => {
            let domainStr = "";
            if (typeof mode === "undefined") {
                mode = InsertWriteMode.APPEND;
            }
            if (typeof domain !== "undefined") {
                domainStr = "?domain="+domain;
            }
            return axios.post(this.getHostPath()+'/collection/'+collection+"/insertData", {
                data: rows
            }, {
                headers: {
                    "x-data": JSON.stringify({
                        "domain": domain,
                        "mode": mode.toString()
                    }),
                },
                maxContentLength: 100000000,
                maxBodyLength: 1000000000
            })
                .then((response: AxiosResponse) => {
                    // handle success
                    if (response.status == 200) {
                        return resolve(response.data.result);
                    }
                    reject(response.data);
                })
                .catch((error: AxiosError) => {
                    reject((error.response) ? error.response.data : error);
                });
        });
    }

    getAllStorages() {
        return new Promise<StorageDataInfo>((resolve, reject) => {
            let dir = this.getHostPath() + '/storages';
            return axios.get(dir)
                .then((response) => {

                    if (typeof response.data === "string") {
                        response.data = JSON.parse(response.data);
                    }
                    return resolve((typeof response.data.storages !== "undefined") ? response.data.storages : []);
                });
        });
    }


    hasStorage(name: string) {
        return new Promise<boolean>((resolve, reject) => {
            let dir = this.getHostPath() + '/storages';
            return axios.get(dir)
                .then((response) => {
                    try {

                        if (typeof response.data === "string") {
                            response.data = JSON.parse(response.data);
                        }
                        const storages = response.data.storages;

                        if (storages.find((f: StorageDataInfo) => f.document == name)) {
                            return resolve(true);
                        }
                    }
                    catch(e) {
                        reject(e);
                    }
                    return resolve(false);

                });
        });
    }

    getStorageData(s: string) {
        return new Promise<StorageDataInfo>((resolve, reject) => {
            let dir = this.getHostPath() + '/storage/'+s;
            return axios.get(dir)
                .then((response) => {
                    try {

                        if (typeof response.data === "string") {
                            response.data = JSON.parse(response.data);
                        }
                        return resolve((typeof response.data !== "undefined") ? response.data : []);
                    }
                    catch(e) {
                        reject(e);
                    }
                });
        });
    }

    getStorageFiltered(s: string, filters: FilterEntry[]) {
        return new Promise<StorageEntry[]>((resolve, reject) => {
            let dir = this.getHostPath() + '/storage/'+s+"/filter";
            return axios.post(dir, JSON.stringify(filters))
                .then((response) => {
                    try {

                        if (typeof response.data === "string") {
                            response.data = JSON.parse(response.data);
                        }
                        const data = response.data.data as StorageEntry[];
                        for (const d of data) {
                            d.datetime = new Date(d.datetime);
                        }

                        return resolve(data);
                    }
                    catch(e) {
                        reject(e);
                    }
                })
                .catch((err: Error) => {
                    return reject(err);
                })
        });
    }
}
