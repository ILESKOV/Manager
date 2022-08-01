const { expect } = require("chai")
const { BigNumber } = require("ethers")
const { ethers } = require("hardhat")

let owner, Manager, Token

beforeEach(async () => {
    ;[owner, user1, user2, user3, user4, user5, user6, user7, user8, user9, user10, user11] = await ethers.getSigners()

    let token = await ethers.getContractFactory("TKN")
    Token = await token.deploy()

    let manager = await ethers.getContractFactory("Manager")
    Manager = await manager.deploy(Token.address, 5000, 60, 10, 4, 3, 2, 1)

    await Token.transfer(user1.address, BigNumber.from("5500000000000000000000"))
    await Token.transfer(user2.address, BigNumber.from("5500000000000000000000"))
    await Token.transfer(user3.address, BigNumber.from("5500000000000000000000"))
    await Token.transfer(user4.address, BigNumber.from("5500000000000000000000"))
    await Token.transfer(user5.address, BigNumber.from("5500000000000000000000"))
    await Token.transfer(user6.address, BigNumber.from("5500000000000000000000"))
    await Token.transfer(user7.address, BigNumber.from("5500000000000000000000"))
    await Token.transfer(user8.address, BigNumber.from("5500000000000000000000"))
    await Token.transfer(user9.address, BigNumber.from("5500000000000000000000"))
    await Token.transfer(user10.address, BigNumber.from("5500000000000000000000"))
    await Token.transfer(user11.address, BigNumber.from("5500000000000000000000"))
    await Token.connect(user1).approve(Manager.address, BigNumber.from("5000000000000000000000"))
    await Token.connect(user2).approve(Manager.address, BigNumber.from("5000000000000000000000"))
    await Token.connect(user3).approve(Manager.address, BigNumber.from("5000000000000000000000"))
    await Token.connect(user4).approve(Manager.address, BigNumber.from("5000000000000000000000"))
    await Token.connect(user5).approve(Manager.address, BigNumber.from("5000000000000000000000"))
    await Token.connect(user6).approve(Manager.address, BigNumber.from("5000000000000000000000"))
    await Token.connect(user7).approve(Manager.address, BigNumber.from("5000000000000000000000"))
    await Token.connect(user8).approve(Manager.address, BigNumber.from("5000000000000000000000"))
    await Token.connect(user9).approve(Manager.address, BigNumber.from("5000000000000000000000"))
    await Token.connect(user10).approve(Manager.address, BigNumber.from("5000000000000000000000"))
    await Token.connect(user11).approve(Manager.address, BigNumber.from("5000000000000000000000"))
    await Manager.connect(user1).deposit()
    await Manager.connect(user2).deposit()
    await Manager.connect(user3).deposit()
    await Manager.connect(user4).deposit()
    await Manager.connect(user5).deposit()
    await Manager.connect(user6).deposit()
    await Manager.connect(user7).deposit()
    await Manager.connect(user8).deposit()
    await Manager.connect(user9).deposit()
    await Manager.connect(user10).deposit()
})

describe("test of not allowing more than 10 depositors", function () {
    it("check 11's depositor rejected", async () => {
        await expect(Manager.connect(user11).deposit()).to.be.revertedWith("All deposits have been made")
    })
})

