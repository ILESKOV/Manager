const { expect } = require("chai")
const { BigNumber } = require("ethers")
const { ethers } = require("hardhat")

let owner, Manager, Token

beforeEach(async () => {
    ;[owner, user1, user2, user3] = await ethers.getSigners()

    let token = await ethers.getContractFactory("Token")
    Token = await token.deploy()

    let manager = await ethers.getContractFactory("Manager")
    Manager = await manager.deploy(Token.address)

    await Token.transfer(user1.address, BigNumber.from("12000000000000000000000"))
})

describe("deposit tests", function () {
    it("check deposit fee is correct", async () => {
        expect(await Manager.connect(user1).getTokenFee()).to.equal(BigNumber.from("5000000000000000000000"))
    })
    it("should revert if user not approved tokens for Manager contract", async () => {
        await expect(Manager.connect(user1).deposit()).to.be.revertedWith("Not enough tokens approved")
    })
    it("should revert if user approved not enough tokens for Manager contract", async () => {
        await Token.connect(user1).approve(Manager.address, BigNumber.from("199000000000000000000"))
        await expect(Manager.connect(user1).deposit()).to.be.revertedWith("Not enough tokens approved")
    })
    it("should revert if user already deposit tokens", async () => {
        await Token.connect(user1).approve(Manager.address, BigNumber.from("10000000000000000000000"))
        await Manager.connect(user1).deposit()
        await expect(Manager.connect(user1).deposit()).to.be.revertedWith("You already deposited")
    })
    it("should check balance of user tokens change after deposit", async () => {
        await Token.connect(user1).approve(Manager.address, BigNumber.from("5000000000000000000000"))
        await Manager.connect(user1).deposit()
        expect(await Token.connect(user1).balanceOf(user1.address)).to.equal(BigNumber.from("7000000000000000000000"))
    })
    it("should check tokens are locked", async () => {
        await Token.connect(user1).approve(Manager.address, BigNumber.from("5000000000000000000000"))
        await Manager.connect(user1).deposit()
        await ethers.provider.send("evm_increaseTime", [60])
        await ethers.provider.send("evm_mine")
        blockNumAfter = await ethers.provider.getBlockNumber()
        blockAfter = await ethers.provider.getBlock(blockNumAfter)
        timestampAfter = blockAfter.timestamp
        expect(await Manager.connect(user1).getUnlockTime(user1.address)).to.equal(timestampAfter)
    })
    it("should check amount of active depositors increased", async () => {
        await Token.connect(user1).approve(Manager.address, BigNumber.from("5000000000000000000000"))
        await Manager.connect(user1).deposit()
        expect(await Manager.connect(user1).getAmountOfDepositors()).to.equal(1)
    })
    it("should check manager balance is changed in balanceOf token function", async () => {
        await Token.connect(user1).approve(Manager.address, BigNumber.from("5000000000000000000000"))
        await Manager.connect(user1).deposit()
        await ethers.provider.send("evm_increaseTime", [60])
        await Manager.connect(user1).createNFT(
            "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/1.png"
        )
        expect(await Token.balanceOf(Manager.address)).to.equal(BigNumber.from("5000000000000000000000"))
    })
    it("should emit an newDepositor event", async () => {
        await Token.connect(user1).approve(Manager.address, BigNumber.from("5000000000000000000000"))
        blockNumAfter = await ethers.provider.getBlockNumber()
        blockAfter = await ethers.provider.getBlock(blockNumAfter)
        timestampAfter = blockAfter.timestamp
        await expect(Manager.connect(user1).deposit())
            .to.emit(Manager, "NewDepositor")
            .withArgs(user1.address, timestampAfter + 1)
    })
})
