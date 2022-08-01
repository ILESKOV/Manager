const { expect } = require("chai")
const { BigNumber } = require("ethers")
const { ethers } = require("hardhat")

let owner, Manager, Token

beforeEach(async () => {
    ;[owner, user1, user2, user3] = await ethers.getSigners()

    let token = await ethers.getContractFactory("TKN")
    Token = await token.deploy()

    let manager = await ethers.getContractFactory("Manager")
    Manager = await manager.deploy(Token.address, 5000, 60, 10, 4, 3, 2, 1)
})

describe("updateTokenFee tests", function () {
    describe("negative test", function () {
        it("should revert if new fee is setted to 0", async () => {
            await expect(Manager.updateTokenFee(0)).to.be.revertedWith("Fee must be higher than 0")
        })
    })
    describe("positive test", function () {
        it("should successfuly update erc20 participation fee", async () => {
            await Manager.updateTokenFee(33000)
            expect(await Manager.getTokenFee()).to.equal(BigNumber.from("33000000000000000000000"))
        })
    })
})

