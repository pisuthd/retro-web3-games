
import * as fastq from "fastq";
import express from "express";
import cors from "cors"
import pkg from 'lib';
import { ethers } from "ethers"

const { ServerLib } = pkg

import 'dotenv/config'

export const serverLib = new ServerLib({
  provider: new ethers.providers.JsonRpcProvider("https://rpc.sandverse.oasys.games")
})


// API

export const app = express();

app.use(express.json());
app.use(cors())

export const server = app.listen(8000, () => {
  console.log(`Server Started at ${8000}`)
})

app.get('/', async (req, res) => {
  return res.status(200).json({ status: "ok" });
});

// new games
app.get('/new', async (req, res) => {

  try {
    // const { body } = req
    // const { gameId, signature, gameOption } = body

    const commitment = await serverLib.requestGameCreation()

    return res.status(200).json({ status: "ok", commitment });
  } catch (e) {
    return res.status(400).json({ status: "error", error: e.message });
  }

})

// get state
app.get('/state/:commitment', async (req, res) => {

  try {
    const { params } = req
    const { commitment } = params

    const state = await serverLib.state(commitment)

    return res.status(200).json({ status: "ok", state });
  } catch (e) {
    return res.status(400).json({ status: "error", error: e.message });
  }


})

// generate proof
app.post('/proof', async (req, res) => {

  try {
    const { body } = req
    const { commitment, position } = body

    const { proof, publicSignals } = await serverLib.generateProof(commitment, position)

    return res.status(200).json({ status: "ok" , proof, publicSignals});
  } catch (e) {
    return res.status(400).json({ status: "error", error: e.message });
  }

})

// update state
app.post('/update', async (req, res) => {

  try {
    const { body } = req
    const { commitment, tx, flag } = body

    await serverLib.updateState(commitment, tx, flag)

    return res.status(200).json({ status: "ok" });
  } catch (e) {
    return res.status(400).json({ status: "error", error: e.message });
  }

})