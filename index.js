const { default: Axios } = require("axios");
const express = require("express");
const axios = require('axios');
const app = express();
var fs = require('fs');

function makeRequest() {

    const apiUrl = fs.readFileSync("data/url.txt", "utf8");
    const body = fs.readFileSync("data/body.txt", "utf8");

    axios({
        method: "post",
        url: apiUrl,
        headers: { "Content-Type": "application/soap+xml;charset=UTF-8" },
        data: body,
    }).then((response) => {
        console.log('success');
    }, (error) => {
        console.error('failed, ', error);
    });

    return new Promise((resolve) => {
       setTimeout(() => resolve({ 'status': 'done' }), 1);
    });
}

async function process(arrayOfPromises) {
    console.time(`process`);
    let responses = await Promise.all(arrayOfPromises);
    for(let r of responses) {
        // console.log('process result:', r);
    }
    console.timeEnd(`process`);
    return;
}
async function handler() {
    
    let arrayOfPromises = [];

    for(let i = 0; i < 500; i++) {
        arrayOfPromises.push(makeRequest())
    }
    
    await process(arrayOfPromises);
    console.log(`processing is complete`);
}

app.get('/', async (req, res) => {
    handler();
    return res.json({ result: "success" });
});

const port = 3000;

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});