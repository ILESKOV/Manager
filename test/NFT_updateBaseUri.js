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
    await ethers.provider.send("evm_increaseTime", [60])
    await Manager.connect(user1).createNFT("ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/1.png")
    await Manager.connect(user2).createNFT("ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/2.png")
    await Manager.connect(user3).createNFT("ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/3.png")
    await Manager.connect(user4).createNFT("ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/4.png")
    await Manager.connect(user5).createNFT("ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/5.png")
    await Manager.connect(user6).createNFT("ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/6.png")
    await Manager.connect(user7).createNFT("ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/7.png")
    await Manager.connect(user8).createNFT("ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/8.png")
    await Manager.connect(user9).createNFT("ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/9.png")
})

describe("update metadata URI", function () {
    it("should revert if caller not the owner", async () => {
        await Manager.connect(user10).createNFT(
            "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/10.png"
        )
        await expect(
            Manager.connect(user10).updateBaseURI("ipfs://bafybeig5yw7u5xy3oynsyxaazkbtu66jxblwexh4aghb3r7dyozdh5upxi/")
        ).to.be.revertedWith("Ownable: caller is not the owner")
    })
    it("should revert if URI was already updated by owner", async () => {
        await Manager.connect(user10).createNFT(
            "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/10.png"
        )
        await Manager.updateBaseURI("ipfs://bafybeig5yw7u5xy3oynsyxaazkbtu66jxblwexh4aghb3r7dyozdh5upxi/")
        await expect(Manager.updateBaseURI("ipfs://bafybeig5ywreverteffxb/")).to.be.revertedWith(
            "Base URI was already updated"
        )
    })
    it("should check _baseUri updated correctly and tokenURI return correct URI", async () => {
        await Manager.connect(user10).createNFT(
            "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/10.png"
        )
        await Manager.updateBaseURI("ipfs://correctlyUpdated/")
        expect(await Manager.connect(user1).tokenURI(1)).to.equal("ipfs://correctlyUpdated/1")
    })
    it("check URI was updated and never be updated again", async () => {
        await Manager.connect(user10).createNFT(
            "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/10.png"
        )
        await Manager.updateBaseURI("ipfs://correctlyUpdated/")
        expect(await Manager.connect(user1).uriWasUpdated()).to.equal(true)
    })
})
