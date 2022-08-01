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

describe("tokenUri return correct URI", function () {
    it("should check _baseUri setted correctly and tokenURI return correct URI", async () => {
        expect(await Manager.connect(user1).tokenURI(1)).to.equal(
            "ipfs://bafybeig5yw7u5xy3oynsyxaazkbtu66jxblwexh4aghb3r7dyozdh5upxi/1"
        )
    })
})
