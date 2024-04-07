

import {ChipmunkDbClient, InsertWriteMode} from "../src/chipmunk/ChipmunkDbClient";

require('dotenv').config()
const express = require('express')
const app = express()
const port = 3333
const c = new ChipmunkDbClient("localhost")
const csv = require('csv-parser');
const fs = require('fs');


new Promise(async () => {

    const data : any[] = [];
    await new Promise((resolve) => {
        fs.createReadStream('./test/fiveminutetestdata.csv')
            .pipe(csv())
            .on('data', (row: any) => {
                data.push(row);
            })
            .on('end', () => {
                resolve(data);
            });
    })

    console.info(await c.getAllDocuments());

    await c.saveDocument("asdas", "32", data, "single")
        .then((doc) => {
            console.info("OKAY", doc);
        })

    await c.getDocument("asdas", "32")
        .then((doc) => {
            console.info(doc);
        })



    console.info(await c.getAllDocuments("asdas"));

})

app.listen(port, () => {
    console.info(`Example app listening at http://localhost:${port}`)
})
