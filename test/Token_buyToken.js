const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

let owner, Token;

beforeEach(async () => {
  [owner, user1, user2, user3] = await ethers.getSigners();

  let token = await ethers.getContractFactory("Token");
  Token = await token.deploy();
});
describe("buyToken tests", function () {
  it("should check constructor mint 75000 tokens for owner", async () => {
    expect(await Token.balanceOf(owner.address)).to.equal(75000);
  });
  it("should revert if value lower than 0.0001", async () => {
    await expect(
      Token.connect(user1).buyToken({
        value: ethers.utils.parseEther("0.000099"),
      })
    ).to.be.revertedWith("1 token cost 0.0001 ETH");
  });
  it("check mint tokens for buyer", async () => {
    await Token.connect(user2).buyToken({
      value: ethers.utils.parseEther("0.01"),
    });
    expect(await Token.connect(user2).balanceOf(user2.address)).to.equal(100);
  });
  it("check token calculation is proper", async () => {
    await Token.connect(user2).buyToken({
      value: ethers.utils.parseEther("0.5"),
    });
    expect(await Token.connect(user2).balanceOf(user2.address)).to.equal(5000);
  });
});