#!/usr/bin/env node

const request = require("request");
const slash = require("slash");
const path = require("path");
const _ = require("lodash");
const download = require("download-file");

// eslint-disable-next-line func-names
exports.startSlave = function (options) {
    const HOST = options.host;
    const DIRECTORY = slash(path.join(process.cwd(), options.dir));

    // eslint-disable-next-line global-require
    const socket = require("socket.io-client")(HOST);

    socket.on("connect", () => {
        console.log("connected");
        request.get(`${HOST}/getCompleteIndex`, (err, res, body) => {
            body = JSON.parse(body);

            // eslint-disable-next-line no-unused-vars
            _.map(body, (item, key) => {
                myDownload(item);
            });
        });
    });
    socket.on("update", (file) => {
        console.log(file, "changed");
        myDownload(file);
    });
    socket.on("remove", (file) => {
        console.log(file, "has been removed");
        // myDownload(file);
    });
    socket.on("disconnect", () => {});

    function myDownload(item) {
        const url = HOST + item;
        const downloadOptions = {
            directory: path.join(DIRECTORY, path.win32.dirname(item)),
            filename: path.win32.basename(item),
        };
        // console.log('url, options', url, options);
        download(url, downloadOptions, (err) => {
            if (err) throw err;
            console.log("downloaded item", item);
        });
    }
};
