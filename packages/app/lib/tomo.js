const axios = require('axios');

class Tomo {

    endpoint
    apiKey

    constructor(args) {

        this.endpoint = args.endpoint
        this.apiKey = args.apiKey

    }

    addHappinessPoint = async (tokenId, point) => {

        const payload = {
            petId: `${tokenId}`,
            add: Number(point)
        }

        const { data } = await axios.post(`${this.endpoint}/play/hp`, payload, {
            headers: {
                "accept": "application/json",
                "content-type": "application/json",
                'x-api-key': `${this.apiKey}`
            }
        })

        return data.data
    }

    checkDailyLimit = async (tokenId) => {


        const { data } = await axios.get(`${this.endpoint}/play/hp/limit?petId=${tokenId}`, {
            headers: {
                "accept": "application/json",
                'x-api-key': `${this.apiKey}`
            }
        })

        return data.data
    }

}

exports.Tomo = Tomo