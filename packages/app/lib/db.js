const PouchDB = require("pouchdb")
const pounchAdapterMemory = require("pouchdb-adapter-memory")

PouchDB.plugin(pounchAdapterMemory)

class Database {

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

    destroy = async () => {
        if (this.isMemory === false) {
            const db = new PouchDB(ACTIVE_GAMES_TABLE)
            await db.destroy()
        }
    }
}

exports.Database = Database