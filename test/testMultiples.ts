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


    c.queryMerge("SELECT * FROM dev_60219fa06021646cb37b206a LIMIT 1000", ["SELECT * FROM dev_60219fa06021646cb37b206a_604be988d1d1a75afff6de8e LIMIT 1000"], "chart2")
        .then((data: any) => {
            console.info(data);
        })
        .catch((error: Error) => {
            console.error(error);
        })

})

app.listen(port, () => {
    console.info(`Example app listening at http://localhost:${port}`)
})
