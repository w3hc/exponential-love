const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers, parseEther } = require("hardhat");

describe("Exponential Love", function () {

  async function deployContracts() {
    const [owner, dao, sponsor1, sponsor2, alice, bob, francis] = await ethers.getSigners();
    const sponsorshipAmount = ethers.parseEther("1")
    const ExponentialLove = await ethers.getContractFactory("ExponentialLove");
    const exponentialLove = await ExponentialLove.deploy(dao, sponsorshipAmount);
    return { exponentialLove, owner, dao, sponsorshipAmount, sponsor1, sponsor2, alice, bob, francis };
  }

  describe("Deployment", function () {
    it("Should set the dao address as the contract owner", async function () {
      const { exponentialLove, dao } = await loadFixture(deployContracts);
      expect(await exponentialLove.owner()).to.equal(await dao.getAddress());
    });
    it("Should set the right sponsorship amount", async function () {
      const { exponentialLove, sponsorshipAmount } = await loadFixture(deployContracts);
      expect(await exponentialLove.sponsorshipAmount()).to.equal(sponsorshipAmount);
    });
  });

  describe("Interactions", function () {
    it("Should add a sponsor", async function () {
      const { exponentialLove, sponsorshipAmount, sponsor1 } = await loadFixture(deployContracts);
      await exponentialLove.connect(sponsor1).addSponsor({value:sponsorshipAmount})
      expect(await exponentialLove.multiplier()).to.equal(1);
    });
    it("Should add 2 sponsors", async function () {
      const { exponentialLove, sponsorshipAmount, sponsor1, sponsor2 } = await loadFixture(deployContracts);
      await exponentialLove.connect(sponsor1).addSponsor({value:sponsorshipAmount})
      await exponentialLove.connect(sponsor2).addSponsor({value:sponsorshipAmount})
      expect(await exponentialLove.multiplier()).to.equal(2);
    });
    it("Should let Alice donate 0.01 ETH", async function () {
      const { exponentialLove, sponsorshipAmount, sponsor1, sponsor2, alice } = await loadFixture(deployContracts);
      await exponentialLove.connect(sponsor1).addSponsor({value:sponsorshipAmount})
      await exponentialLove.connect(sponsor2).addSponsor({value:sponsorshipAmount})
      await alice.sendTransaction({
        to: exponentialLove.getAddress(),
        value: ethers.parseEther('0.01')
      });
      expect(await exponentialLove.total()).to.equal(ethers.parseEther('0.03'));

    });
    it("Should let the DAO withdraw the total", async function () {
      const { exponentialLove, sponsorshipAmount, sponsor1, sponsor2, alice, dao } = await loadFixture(deployContracts);
      await exponentialLove.connect(sponsor1).addSponsor({value:sponsorshipAmount})
      await exponentialLove.connect(sponsor2).addSponsor({value:sponsorshipAmount})
      await alice.sendTransaction({
        to: exponentialLove.getAddress(),
        value: ethers.parseEther('0.01')
      });
      expect(await exponentialLove.total()).to.equal(ethers.parseEther('0.03'));
      await exponentialLove.withdraw()
      expect(await ethers.provider.getBalance(dao)).to.equal(ethers.parseEther('10000.03'));
    });
  });
});