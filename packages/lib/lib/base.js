import PouchDB from 'pouchdb';
import { buildPoseidon } from "circomlibjs"
import pounchAdapterMemory from "pouchdb-adapter-memory"
import { slugify, encode } from "./helpers";

PouchDB.plugin(pounchAdapterMemory)

export class Base {

    isMemory

    constructor() {
        this.isMemory = false
    }

    useMemory = () => {
        this.isMemory = true
    }

    getDb = (slug) => {
        if (this.isMemory) {
            return new PouchDB(slug, { adapter: 'memory' })
        }
        return new PouchDB(slug)
    }

    hash = async (content) => {
        const poseidon = await buildPoseidon()
        return poseidon.F.toObject(poseidon([encode(content)]))
    }

    hashItems = async (items) => {
        const poseidon = await buildPoseidon()
        let hashed = []
        for (let item of items) {
            hashed.push(await encode(item))
        }
        const preImage = hashed.reduce((sum, x) => sum + x, 0n);
        return poseidon.F.toObject(poseidon([preImage]))
    }

    destroy = async () => {
        if (this.isMemory === false) {
            // const collections = await this.allCollection()
            // for (let collection of collections) {
            //     const db = new PouchDB(collection)
            //     await db.destroy();
            //     // delete directory recursively
            //     await fs.rm(collection, { recursive: true, force: true })
            // }
            const db = new PouchDB(ACTIVE_GAMES_TABLE)
            await db.destroy()
        }

    }

}   