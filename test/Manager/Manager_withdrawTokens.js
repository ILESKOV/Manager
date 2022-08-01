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

    await Token.transfer(user1.address, BigNumber.from("5500000000000000000000"))
    await Token.connect(user1).approve(Manager.address, BigNumber.from("5000000000000000000000"))
    await Manager.connect(user1).deposit()
    await ethers.provider.send("evm_increaseTime", [60])
    await Manager.connect(user1).createNFT("ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/1.png")
})

describe("withdrawTokens tests", function () {
    describe("negative test", function () {
        it("should revert if user doen't deposit required amount of tokens", async () => {
            await expect(Manager.withdrawTokens(BigNumber.from("5001000000000000000000"))).to.be.revertedWith(
                "Not enough tokens available"
            )
        })
    })
    describe("positive tests", function () {
        it("should check owner balance was changed", async () => {
            await Manager.withdrawTokens(BigNumber.from("150000000000000000000"))
            expect(await Token.balanceOf(owner.address)).to.equal(BigNumber.from("69650000000000000000000"))
        })
        it("should check managerBalance is changed", async () => {
            await Manager.withdrawTokens(BigNumber.from("150000000000000000000"))
            expect(await Manager.getContractBalance()).to.equal(BigNumber.from("4850000000000000000000"))
        })
        it("should check managerBalance is changed", async () => {
            blockNumAfter = await ethers.provider.getBlockNumber()
            blockAfter = await ethers.provider.getBlock(blockNumAfter)
            timestampAfter = blockAfter.timestamp
            await expect(Manager.withdrawTokens(BigNumber.from("150000000000000000000")))
                .to.emit(Manager, "Withdrawal")
                .withArgs(BigNumber.from("150000000000000000000"), timestampAfter + 1)
        })
    })
})

