import {ChipmunkDbClient, InsertWriteMode} from "../src/chipmunk/ChipmunkDbClient";

require('dotenv').config()
const express = require('express')
const app = express()
const port = 3333
const c = new ChipmunkDbClient("localhost")
const csv = require('csv-parser');
const fs = require('fs');

c.getAllCollections()
    .then((d) => {
        console.info(d);
    })

c.query("SELECT * FROM testdomain WHERE datetime > '2020-09-10' LIMIT 10", "chart2")
    .then((data: any) => {
        console.info(data);
    })
    .catch((error: Error) => {
        console.error(error);
    })

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



    c.insertData("testdomain", data, "chart1")
        .then(() => {

            console.info("MUH");
            c.dropColumns("testdomain", ["max", "min"], "chart1")
                .then(() => {
                    console.log("deleted max, min columns");

                    c.dropColumns("testdomain", ["*"], "chart1")
                        .then(() => {
                            console.log("deleted all columns");

                            c.insertData("leerer_workspace", data, "chart1", InsertWriteMode.CREATE)
                                .then(() => {

                                    console.log("neues dataframe erstellt");

                                })
                                .catch((err: Error) => {
                                    console.error(err);
                                })

                        })
                        .catch((err: Error) => {
                            console.error(err);
                        })

                })
                .catch((err: Error) => {
                    console.error(err);
                })




        })
        .catch((error: Error) => {
            console.error(error);
        })




})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
