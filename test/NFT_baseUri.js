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

describe("tokenUri return correct URI", function () {
  it("should check _baseUri setted correctly and tokenURI return correct URI", async () => {
    expect(await Manager.connect(user1).tokenURI(1)).to.equal(
      "ipfs://bafybeig5yw7u5xy3oynsyxaazkbtu66jxblwexh4aghb3r7dyozdh5upxi/1"
    );
  });
});
