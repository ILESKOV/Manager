const { expect } = require("chai")
const { BigNumber } = require("ethers")
const { ethers } = require("hardhat")

let owner, Token

beforeEach(async () => {
    ;[owner, user1, user2, user3] = await ethers.getSigners()
    provider = ethers.getDefaultProvider()

    let token = await ethers.getContractFactory("Token")
    Token = await token.deploy()
    await Token.connect(user1).buyToken({
        value: ethers.utils.parseEther("1.2"),
    })
    await Token.connect(user2).buyToken({
        value: ethers.utils.parseEther("0.5"),
    })
})
describe("withdrawETH tests", function () {
    it("should revert if not owner is caller", async () => {
        await expect(Token.connect(user1).withdrawETH(BigNumber.from("1000000000000000000"))).to.be.revertedWith(
            "Ownable: caller is not the owner"
        )
    })
    it("should revert if owner request too much ETH", async () => {
        await expect(Token.withdrawETH(BigNumber.from("10000000000000000000"))).to.be.revertedWith("Not enough ETH")
    })
    it("should check amount of ether chanched after owner withdrawed ETH", async () => {
        await Token.withdrawETH(BigNumber.from("1000000000000000000"))
        expect(await ethers.provider.getBalance(Token.address)).to.equal("700000000000000000")
    })
})
