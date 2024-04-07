

import {
    ChipmunkDbClient,
    FilterEntry,
    InsertWriteMode,
    StorageDataInfo,
    StorageEntry
} from "../src/chipmunk/ChipmunkDbClient";

require('dotenv').config()
const express = require('express')
const app = express()
const port = 3333
const c = new ChipmunkDbClient("localhost")
const csv = require('csv-parser');
const fs = require('fs');


new Promise(async () => {


    console.info(await c.getAllStorages());

    console.log(await c.hasStorage("test_code"));

    await c.getStorageData("test_code")
        .then((doc: StorageDataInfo) => {
            console.log(doc);
        })

    let filters = [
        FilterEntry.create("cmc.rank")
    ]

    await c.getStorageFiltered("test_code", filters)
        .then((doc: StorageEntry[]) => {
            console.log(doc);
        })

    filters = [
        FilterEntry.create("cmc.rank", ["ETH"])
    ]

    await c.getStorageFiltered("test_code", filters)
        .then((doc: StorageEntry[]) => {
            console.log(doc);
        })



    console.log(await c.getAllDocuments("asdas"));

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
