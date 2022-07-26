const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

let owner, Manager, Token;

beforeEach(async () => {
  [
    owner,
    user1,
    user2,
    user3,
    user4,
    user5,
    user6,
    user7,
    user8,
    user9,
    user10,
  ] = await ethers.getSigners();

  let token = await ethers.getContractFactory("Token");
  Token = await token.deploy();

  let manager = await ethers.getContractFactory("Manager");
  Manager = await manager.deploy(Token.address);

  await Token.transfer(user1.address, 5500);
  await Token.transfer(user2.address, 5500);
  await Token.transfer(user3.address, 5500);
  await Token.transfer(user4.address, 5500);
  await Token.transfer(user5.address, 5500);
  await Token.transfer(user6.address, 5500);
  await Token.transfer(user7.address, 5500);
  await Token.transfer(user8.address, 5500);
  await Token.transfer(user9.address, 5500);
  await Token.transfer(user10.address, 5500);
  await Token.connect(user1).approve(Manager.address, 5000);
  await Token.connect(user2).approve(Manager.address, 5000);
  await Token.connect(user3).approve(Manager.address, 5000);
  await Token.connect(user4).approve(Manager.address, 5000);
  await Token.connect(user5).approve(Manager.address, 5000);
  await Token.connect(user6).approve(Manager.address, 5000);
  await Token.connect(user7).approve(Manager.address, 5000);
  await Token.connect(user8).approve(Manager.address, 5000);
  await Token.connect(user9).approve(Manager.address, 5000);
  await Token.connect(user10).approve(Manager.address, 5000);
  await Manager.connect(user1).deposit();
  await Manager.connect(user2).deposit();
  await Manager.connect(user3).deposit();
  await Manager.connect(user4).deposit();
  await Manager.connect(user5).deposit();
  await Manager.connect(user6).deposit();
  await Manager.connect(user7).deposit();
  await Manager.connect(user8).deposit();
  await Manager.connect(user9).deposit();
  await Manager.connect(user10).deposit();
  await ethers.provider.send("evm_increaseTime", [60]);
  await Manager.connect(user1).createNFT(
    "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/1.png"
  );
  await Manager.connect(user2).createNFT(
    "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/2.png"
  );
  await Manager.connect(user3).createNFT(
    "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/3.png"
  );
  await Manager.connect(user4).createNFT(
    "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/4.png"
  );
  await Manager.connect(user5).createNFT(
    "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/5.png"
  );
  await Manager.connect(user6).createNFT(
    "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/6.png"
  );
  await Manager.connect(user7).createNFT(
    "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/7.png"
  );
  await Manager.connect(user8).createNFT(
    "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/8.png"
  );
  await Manager.connect(user9).createNFT(
    "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/9.png"
  );
});

describe("createMetadata tests", function () {
  it("check date of creation setted properly", async () => {
    await Manager.connect(user10).createNFT(
      "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/10.png"
    );
    blockNumAfter = await ethers.provider.getBlockNumber();
    blockAfter = await ethers.provider.getBlock(blockNumAfter);
    timestampAfter = blockAfter.timestamp;
    expect((await Manager.getOwnershipRecord(user10.address))[2]).to.equal(
      timestampAfter
    );
  });
  it("should change ownership id for user1", async () => {
    expect((await Manager.getOwnershipRecord(user1.address))[0]).to.equal(
      BigNumber.from("1")
    );
  });
  it("should change ownership id for user3", async () => {
    expect((await Manager.getOwnershipRecord(user7.address))[0]).to.equal(
      BigNumber.from("7")
    );
  });
  it("check rarity setted properly for user1", async () => {
    expect((await Manager.getOwnershipRecord(user1.address))[1]).to.equal(
      "40%"
    );
  });
  it("check rarity setted properly for user2", async () => {
    expect((await Manager.getOwnershipRecord(user2.address))[1]).to.equal(
      "40%"
    );
  });
  it("check rarity setted properly for user3", async () => {
    expect((await Manager.getOwnershipRecord(user3.address))[1]).to.equal(
      "40%"
    );
  });
  it("check rarity setted properly for user4", async () => {
    expect((await Manager.getOwnershipRecord(user4.address))[1]).to.equal(
      "40%"
    );
  });
  it("check rarity setted properly for user5", async () => {
    expect((await Manager.getOwnershipRecord(user5.address))[1]).to.equal(
      "30%"
    );
  });
  it("check rarity setted properly for user6", async () => {
    expect((await Manager.getOwnershipRecord(user6.address))[1]).to.equal(
      "30%"
    );
  });
  it("check rarity setted properly for user7", async () => {
    expect((await Manager.getOwnershipRecord(user7.address))[1]).to.equal(
      "30%"
    );
  });
  it("check rarity setted properly for user8", async () => {
    expect((await Manager.getOwnershipRecord(user8.address))[1]).to.equal(
      "20%"
    );
  });
  it("check rarity setted properly for user9", async () => {
    expect((await Manager.getOwnershipRecord(user9.address))[1]).to.equal(
      "20%"
    );
  });
  it("check rarity setted properly for user10", async () => {
    await Manager.connect(user10).createNFT(
      "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/10.png"
    );
    expect((await Manager.getOwnershipRecord(user10.address))[1]).to.equal(
      "10%"
    );
  });
  it("check img setted properly for user1", async () => {
    expect((await Manager.getOwnershipRecord(user1.address))[3]).to.equal(
      "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/1.png"
    );
  });
  it("check img setted properly for user2", async () => {
    expect((await Manager.getOwnershipRecord(user2.address))[3]).to.equal(
      "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/2.png"
    );
  });
  it("check img setted properly for user3", async () => {
    expect((await Manager.getOwnershipRecord(user3.address))[3]).to.equal(
      "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/3.png"
    );
  });
  it("check img setted properly for user4", async () => {
    expect((await Manager.getOwnershipRecord(user4.address))[3]).to.equal(
      "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/4.png"
    );
  });
  it("check img setted properly for user5", async () => {
    expect((await Manager.getOwnershipRecord(user5.address))[3]).to.equal(
      "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/5.png"
    );
  });
  it("check img setted properly for user6", async () => {
    expect((await Manager.getOwnershipRecord(user6.address))[3]).to.equal(
      "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/6.png"
    );
  });
  it("check img setted properly for user7", async () => {
    expect((await Manager.getOwnershipRecord(user7.address))[3]).to.equal(
      "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/7.png"
    );
  });
  it("check img setted properly for user8", async () => {
    expect((await Manager.getOwnershipRecord(user8.address))[3]).to.equal(
      "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/8.png"
    );
  });
  it("check img setted properly for user9", async () => {
    expect((await Manager.getOwnershipRecord(user9.address))[3]).to.equal(
      "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/9.png"
    );
  });
  it("check img setted properly for user10", async () => {
    await Manager.connect(user10).createNFT(
      "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/10.png"
    );
    expect((await Manager.getOwnershipRecord(user10.address))[3]).to.equal(
      "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/10.png"
    );
  });
});
