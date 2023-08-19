const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("GameItem NFT", () => {

    let gameItem
    let admin
    let alice
    let bob

    before(async () => {

        [admin, alice, bob] = await ethers.getSigners();

        const GameItem = await ethers.getContractFactory("GameItem");

        gameItem = await GameItem.deploy("https://api.cryptokitties.co/kitties/{id}")

    })

    it("should authorize NFT success", async function () {

        await gameItem.connect(admin).authorise(
            "My GameItem NFT",
            "https://api.cryptokitties.co/kitties/1",
            ethers.parseEther("1"),
            ethers.parseEther("0.3")
        )

        // checking prices
        const price = await gameItem.tokenPrice(1)
        expect(price).to.equal(ethers.parseEther("1"))

        const buyback = await gameItem.tokenBuyback(1)
        expect(buyback).to.equal(ethers.parseEther("0.3"))

        const uri = await gameItem.uri(1)
        expect(uri).to.equal("https://api.cryptokitties.co/kitties/1")
    })

    it("should mint NFT success", async function () {

        await gameItem.connect(alice).mint(
            alice.address,
            1,
            10,
            {
                value: ethers.parseEther("10")
            }
        )

        expect(await gameItem.balanceOf(alice.address, 1)).to.equal(10)

        // checking supply
        const supply = await gameItem.tokenSupply(1)
        expect(supply).to.equal(10)
    })

    it("should return NFT success", async function () {

        await gameItem.connect(alice).buyback(
            alice.address,
            1,
            5
        )

        expect(await gameItem.balanceOf(alice.address, 1)).to.equal(5)

        // checking supply
        const supply = await gameItem.tokenSupply(1)
        expect(supply).to.equal(5)
    })
})