const path = require("path");
const fs = require("fs");

export let serverInfo: IServerInfo;

const rawInfo: string =
    fs.readFileSync(path.join(__dirname, "../serverInfo.json"));
serverInfo =  JSON.parse(rawInfo);