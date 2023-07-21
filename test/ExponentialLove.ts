const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Incrementor", function () {

  async function deployContracts() {
    const [owner, dao, sponsor, alice, bob] = await ethers.getSigners();
    const ExponentialLove = await ethers.getContractFactory("ExponentialLove");
    const exponentialLove = await ExponentialLove.deploy(dao);
    return { exponentialLove, owner, dao, sponsor, alice, bob };
  }

  describe("Deployment", function () {
    it("Should set the dao as the owner", async function () {
      const { exponentialLove, dao } = await loadFixture(deployContracts);
      expect(await exponentialLove.owner()).to.equal(await dao.getAddress());
    });
  });

  describe("Interactions", function () {
    it("Should withdraw the whole contract balance", async function () {
      const { exponentialLove, dao } = await loadFixture(deployContracts);
      await exponentialLove.withdraw()
    });
  });
});