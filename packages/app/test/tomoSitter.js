const { ethers } = require("hardhat")
const { expect } = require("chai")

const { Tomo } = require("../lib/tomo")

describe("TomoSitter", () => {

    let tomoSitter
    let tomoServer
    let erc721

    let alice
    let bob
    let charlie

    before(async () => {

        [alice, bob, charlie] = await ethers.getSigners()

        const MockERC721 = await ethers.getContractFactory("MockERC721");

        erc721 = await MockERC721.deploy("Mock NFT", "MOCK")

        const TomoSitter = await ethers.getContractFactory("TomoSitter");

        tomoSitter = await TomoSitter.deploy(erc721)

        tomoServer = new Tomo({
            endpoint: process.env.TOMO_ENDPOINT,
            apiKey: process.env.TOMO_API_KEY
        })
    })

    it("should lock NFT in the contract success", async function () {

        // mint 2 NFT
        await erc721.mint(alice.address, 434)
        await erc721.mint(bob.address, 435)
        await erc721.mint(charlie.address, 436)

        expect(await erc721.balanceOf(alice.address)).to.equal(1)
        expect(await erc721.balanceOf(bob.address)).to.equal(1)
        expect(await erc721.balanceOf(charlie.address)).to.equal(1)

        // approve NFTs
        await erc721.connect(alice).setApprovalForAll(tomoSitter.target, true)
        await erc721.connect(bob).setApprovalForAll(tomoSitter.target, true)
        await erc721.connect(charlie).setApprovalForAll(tomoSitter.target, true)

        // lock them
        await tomoSitter.connect(alice).lock(434)
        await tomoSitter.connect(bob).lock(435)
        await tomoSitter.connect(charlie).lock(436)

        expect(await tomoSitter.shared(434)).to.equal(alice.address)
        expect(await tomoSitter.shared(435)).to.equal(bob.address)
        expect(await tomoSitter.shared(436)).to.equal(charlie.address)

        const tokenIds = await tomoSitter.currentLockedTokens()

        expect(Number(tokenIds[0])).to.equal(434)
        expect(Number(tokenIds[1])).to.equal(435)
        expect(Number(tokenIds[2])).to.equal(436)

    })

    it("should call TomoAPI and raise happiness level success", async function () {

        const tokenIds = await tomoSitter.currentLockedTokens()

        for (let tokenId of tokenIds) {
            const id = Number(tokenId)
            const { limit } = await tomoServer.checkDailyLimit(id)
            expect(limit > 0).to.true

            // add happiness point
            const { added } = await tomoServer.addHappinessPoint(id, 10)
            expect(added).to.equal(10)
        }

    })

    it("should unlock Tomo NFTs success", async function () {

        await tomoSitter.connect(alice).unlock(434)
        await tomoSitter.connect(bob).unlock(435)
        await tomoSitter.connect(charlie).unlock(436)

        expect(await tomoSitter.shared(434)).to.equal("0x0000000000000000000000000000000000000000")
        expect(await tomoSitter.shared(435)).to.equal("0x0000000000000000000000000000000000000000")
        expect(await tomoSitter.shared(436)).to.equal("0x0000000000000000000000000000000000000000")

    })

})