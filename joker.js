const http = require("http");
const https = require('follow-redirects').https;
var fs = require("fs");


function chuckJoke(CBfunction) {
    let options = {
        method: "GET",
        hostname: "api.icndb.com",
        path: "/jokes/random",
        headers: {
            Cookie: "__cfduid=da6ea4e35ff82c06c87e501a09f1fa26c1599585962",
            "User-Agent": "PostmanRuntime/7.26.3",
        },
        maxRedirects: 20,
    };
    let req = https.request(options, function (res) {
        let chunks = [];
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
        res.on("end", function () {
            let body = Buffer.concat(chunks);
            let joke = JSON.parse(body.toString()).value.joke;
            //console.log(joke);
            CBfunction(joke);
        });
        res.on("error", function (error) {
            console.log(error);
        });
    });
    req.end();
}

function dadJoke(CBfunction) {
    let options = {
        'method': 'GET',
        'hostname': 'icanhazdadjoke.com',
        'path': '/',
        'headers': {
          'Accept': 'application/json',
          'Cookie': '__cfduid=d8841a83988bb296641ab0fa52eeaa4ba1599593903'
        },
        'maxRedirects': 20
    };
    let req = https.request(options, function (res) {
        let chunks = [];
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
        res.on("end", function () {
            // var body = Buffer.concat(chunks);
            // console.log(body.toString());

            let body = Buffer.concat(chunks);
            let joke = JSON.parse(body.toString()).joke;
            //console.log(joke);
            CBfunction(joke)
        });
        res.on("error", function (error) {
            console.log(error);
        });
    });
    req.end();
}

function mamaJoke(CBfunction) {
    let options = {
        'method': 'GET',
        'hostname': 'api.yomomma.info',
        'path': '/',
        'headers': {
        },
        'maxRedirects': 20
    };
    let req = https.request(options, function (res) {
        let chunks = [];
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
        res.on("end", function () {
            // var body = Buffer.concat(chunks);
            // console.log(body.toString());

            let body = Buffer.concat(chunks);
            let joke = JSON.parse(body.toString()).joke;
            //console.log(joke);
            CBfunction(joke)
        });
        res.on("error", function (error) {
            console.log(error);
        });
    });
    req.end();
}

function ronSaid(CBfunction) {
    let options = {
        'method': 'GET',
        'hostname': 'ron-swanson-quotes.herokuapp.com',
        'path': '/v2/quotes',
        'headers': {
        },
        'maxRedirects': 20
    };
    let req = https.request(options, function (res) {
        let chunks = [];
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
        res.on("end", function () {
            // var body = Buffer.concat(chunks);
            // console.log(body.toString());

            let body = Buffer.concat(chunks);
            let joke = JSON.parse(body.toString())[0];
            //console.log(joke);
            CBfunction(joke)
        });
        res.on("error", function (error) {
            console.log(error);
        });
    });
    req.end();
}
function Joker(joke) {
    console.log(joke);
}

//chuckJoke(Joker);
//dadJoke(Joker);
//mamaJoke(Joker)
//ronSaid(Joker)


//chuckJoke(Joker)
module.exports.Chuck = chuckJoke
module.exports.Dad = dadJoke
module.exports.Momma = mamaJoke
module.exports.Ron = ronSaid