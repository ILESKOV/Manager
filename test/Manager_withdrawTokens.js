const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

let owner, Manager, Token;

beforeEach(async () => {
  [owner, user1, user2, user3] = await ethers.getSigners();

  let token = await ethers.getContractFactory("Token");
  Token = await token.deploy();

  let manager = await ethers.getContractFactory("Manager");
  Manager = await manager.deploy(Token.address);

  await Token.transfer(user1.address, 5500);
  await Token.connect(user1).approve(Manager.address, 5000);
  await Manager.connect(user1).deposit();
  await ethers.provider.send("evm_increaseTime", [60]);
  await Manager.connect(user1).createNFT(
    "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/1.png"
  );
});

describe("withdrawTokens tests", function () {
  it("should revert if user doen't deposit required amount of tokens", async () => {
    await expect(Manager.withdrawTokens(5001)).to.be.revertedWith(
      "Not enough tokens available"
    );
  });
  it("should check owner balance was changed", async () => {
    await Manager.withdrawTokens(150);
    expect(await Token.balanceOf(owner.address)).to.equal(69650);
  });
  it("should check managerBalance is changed", async () => {
    await Manager.withdrawTokens(150);
    expect(await Manager.getContractBalance()).to.equal(4850);
  });
  it("should check managerBalance is changed", async () => {
    blockNumAfter = await ethers.provider.getBlockNumber();
    blockAfter = await ethers.provider.getBlock(blockNumAfter);
    timestampAfter = blockAfter.timestamp;
    await expect(Manager.withdrawTokens(150))
      .to.emit(Manager, "Withdrawal")
      .withArgs(150, timestampAfter + 1);
  });
});
