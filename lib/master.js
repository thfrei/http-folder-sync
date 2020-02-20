#!/usr/bin/env node

const express = require("express");
const path = require("path");
const serveIndex = require("serve-index");

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const _ = require("lodash");
const slash = require("slash");
const watch = require("node-watch");
const fs = require("fs");
const ngrok = require("ngrok");

const glob = require("glob");


exports.startServer = async (options) => {
    const DIRECTORY = options.directory || ".";
    const PORT = _.toNumber(options.port) || 3000;

    const root = slash(path.join(process.cwd(), DIRECTORY));
    console.log("root", root);

    app.use("/", express.static(root));
    app.use("/", serveIndex(root, { icons: true }));

    app.get("/getCompleteIndex", (req, res) => {
        const globFolder = slash(path.join(root, "**"));
        const globOptions = {
            mark: true, // marks folder with trailing /
            nodir: true,
        };
        let globResult = glob.sync(globFolder, globOptions);
        // eslint-disable-next-line arrow-body-style
        globResult = _.map(globResult, (item) => {
            return sanitizeFileName(item);
        });
        res.json(globResult);
    });

    // eslint-disable-next-line no-unused-vars
    io.on("connection", socket => {
        // console.log('a user connected');
    });

    http.listen(PORT, () => {
        console.log(`listening on *: ${PORT}`);
    });

    function sanitizeFileName(file) {
        return file.replace(root, "");
    }

    watch(root, { recursive: true }, (evt, name) => {
        const file = slash(name);
        if (evt === "update") {
            console.log("event", evt, name);
            try {
                const isFile = fs.lstatSync(name).isFile();
                if (isFile) {
                    console.log("%s changed.", sanitizeFileName(file));
                    io.emit("update", sanitizeFileName(file));
                }
            } catch (err) {
                // Handle error
                if (err.code === "ENOENT") {
                    // no such file or DIRECTORY
                    // do something
                } else {
                    // do something else
                }
            }
        }
        if (evt === "remove") {
            console.log("%s was removed.", sanitizeFileName(file));
            io.emit("remove", sanitizeFileName(file));
        }
    });

    const url = await ngrok.connect(
        {
            addr: PORT,
        }
    ); // https://757c1652.ngrok.io -> http://localhost:9090
    console.log(`URL: ${url}`);
    console.log(`Now run: http-folder-sync-slave -h ${url}`);
};
