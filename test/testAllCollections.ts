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
