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

describe("updateLockedPeriod tests", function () {
    it("should successfuly update locked Period", async () => {
        await Manager.updateLockedPeriod(1500)
        expect(await Manager.getLockedPeriod()).to.equal(1500)
    })
})
