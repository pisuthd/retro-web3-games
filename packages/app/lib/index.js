const express = require("express")
const cors = require("cors")
const http = require("http")

const { ethers } = require("ethers")

const app = express();

app.use(express.json());
app.use(cors())

//initialize a http server
const server = http.createServer(app);

app.get('/', async (req, res) => {
    return res.status(200).json({ status: "ok" });
});

server.listen(8000, () => {
    console.log(`Server Started at ${8000}`)
})

exports.app = app
exports.server = server