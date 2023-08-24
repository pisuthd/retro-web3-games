const chai = require("chai")
const chaiHttp = require("chai-http")
const { server } = require("../lib/index.js")

chai.use(chaiHttp)

const { expect } = chai

describe('API', function () {

    before(function () {
        // server.useLocal()
    })

    it('should get server status success', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                const { body, status } = res
                expect(status).equal(200)
                expect(body.status).equal("ok")
                done();
            });
    })


})