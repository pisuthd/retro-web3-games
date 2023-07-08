// import chai from "chai";
// import chaiHttp from "chai-http"

// import { server, serverLib } from "../lib/index.js";

// chai.use(chaiHttp)

// const { expect } = chai

// describe('#api', function () {

//     before(function () {
//         serverLib.useMemory()
//     })

//     it('should get server status success ', (done) => {
//         chai.request(server)
//             .get('/')
//             .end((err, res) => {
//                 const { body, status } = res
//                 expect(status).equal(200)
//                 expect(body.status).equal("ok")
//                 done();
//             });
//     })

//     it('should get server list success ', (done) => {
//         chai.request(server)
//             .get('/games')
//             .end((err, res) => {
//                 const { body, status } = res 
//                 expect(body.games[0].name).to.equal("Minesweeper")
//                 done();
//             });
//     })

// })