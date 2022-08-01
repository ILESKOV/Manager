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
})

describe("createNFT tests", function () {
    describe("negative tests", function () {
        it("should revert if user has already minted an NFT", async () => {
            await Manager.connect(user1).deposit()
            await ethers.provider.send("evm_increaseTime", [60])
            await Manager.connect(user1).createNFT(
                "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/1.png"
            )
            await expect(
                Manager.connect(user1).createNFT(
                    "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/10.png"
                )
            ).to.be.revertedWith("You have already minted your NFT")
        })
        it("should revert if user hasn't made a deposit", async () => {
            await expect(
                Manager.connect(user1).createNFT(
                    "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/1.png"
                )
            ).to.be.revertedWith("Deposit required")
        })
        it("should revert if tokens still locked", async () => {
            await Manager.connect(user1).deposit()
            await expect(
                Manager.connect(user1).createNFT(
                    "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/1.png"
                )
            ).to.be.revertedWith("Not available yet. Wait...")
        })
    })
    describe("positive tests", function () {
        it("check token Id before function call is correct", async () => {
            expect(await Manager.connect(user1).getLatestTokenId()).to.equal(0)
        })
        it("check token Id was incremented", async () => {
            await Manager.connect(user1).deposit()
            await ethers.provider.send("evm_increaseTime", [60])
            await Manager.connect(user1).createNFT(
                "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/1.png"
            )
            expect(await Manager.connect(user1).getLatestTokenId()).to.equal(1)
        })
        it("should check manager balance 0 before NFT is created for user", async () => {
            await Manager.connect(user1).deposit()
            expect(await Manager.getContractBalance()).to.equal(0)
        })
        it("should check managerBalance is changed", async () => {
            await Manager.connect(user1).deposit()
            await ethers.provider.send("evm_increaseTime", [60])
            await Manager.connect(user1).createNFT(
                "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/1.png"
            )
            expect(await Manager.getContractBalance()).to.equal(BigNumber.from("5000000000000000000000"))
        })
        it("check NFTminted event was emited", async () => {
            await Manager.connect(user1).deposit()
            await ethers.provider.send("evm_increaseTime", [60])
            await expect(
                Manager.connect(user1).createNFT(
                    "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/1.png"
                )
            )
                .to.emit(Manager, "NFTminted")
                .withArgs(user1.address, 1)
        })
    })
})
