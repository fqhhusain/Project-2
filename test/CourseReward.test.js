const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CourseReward", function () {
  let courseReward;
  let owner, student1, student2, stranger;
  let rewardAmount, deadline;

  beforeEach(async function () {
    [owner, student1, student2, stranger] = await ethers.getSigners();

    rewardAmount = ethers.parseEther("0.1");
    deadline = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now

    const CourseReward = await ethers.getContractFactory("CourseReward");
    courseReward = await CourseReward.deploy(rewardAmount, deadline, {
      value: ethers.parseEther("1.0"), // fund contract with 1 ETH
    });
    await courseReward.waitForDeployment();
  });

  // ─── Deployment ───────────────────────────────────────────────
  describe("Deployment", function () {
    it("should set the correct owner", async function () {
      expect(await courseReward.owner()).to.equal(owner.address);
    });

    it("should initialize with correct reward amount and deadline", async function () {
      expect(await courseReward.rewardAmount()).to.equal(rewardAmount);
      expect(await courseReward.deadline()).to.equal(deadline);
    });
  });

  // ─── Whitelist ────────────────────────────────────────────────
  describe("Whitelist", function () {
    it("should allow owner to whitelist a student", async function () {
      await courseReward.addToWhitelist(student1.address);
      expect(await courseReward.whitelist(student1.address)).to.be.true;
    });

    it("should reject non-owner from whitelisting", async function () {
      await expect(
        courseReward.connect(stranger).addToWhitelist(student1.address)
      ).to.be.revertedWith("Only owner can call this");
    });
  });

  // ─── Set Reward Amount ────────────────────────────────────────
  describe("Set Reward Amount", function () {
    it("should allow owner to change reward amount", async function () {
      const newAmount = ethers.parseEther("0.2");
      await courseReward.setRewardAmount(newAmount);
      expect(await courseReward.rewardAmount()).to.equal(newAmount);
    });

    it("should emit RewardAmountChanged event", async function () {
      const newAmount = ethers.parseEther("0.2");
      await expect(courseReward.setRewardAmount(newAmount))
        .to.emit(courseReward, "RewardAmountChanged")
        .withArgs(rewardAmount, newAmount);
    });

    it("should reject non-owner from changing amount", async function () {
      await expect(
        courseReward.connect(stranger).setRewardAmount(ethers.parseEther("0.2"))
      ).to.be.revertedWith("Only owner can call this");
    });
  });

  // ─── Claim ────────────────────────────────────────────────────
  describe("Claim", function () {
    beforeEach(async function () {
      await courseReward.addToWhitelist(student1.address);
    });

    it("should allow whitelisted student to claim and receive ETH", async function () {
      const before = await ethers.provider.getBalance(student1.address);
      await courseReward.connect(student1).claim();
      const after = await ethers.provider.getBalance(student1.address);
      expect(after).to.be.gt(before);
    });

    it("should mark student as claimed after claiming", async function () {
      await courseReward.connect(student1).claim();
      expect(await courseReward.hasClaimed(student1.address)).to.be.true;
    });

    it("should emit RewardClaimed event", async function () {
      await expect(courseReward.connect(student1).claim())
        .to.emit(courseReward, "RewardClaimed")
        .withArgs(student1.address, rewardAmount);
    });

    it("should reject double claim", async function () {
      await courseReward.connect(student1).claim();
      await expect(
        courseReward.connect(student1).claim()
      ).to.be.revertedWith("Already claimed");
    });

    it("should reject non-whitelisted student", async function () {
      await expect(
        courseReward.connect(stranger).claim()
      ).to.be.revertedWith("Not whitelisted");
    });

    // ✅ NEW: covers the "Insufficient balance" branch (line 48)
    it("should reject claim when contract has insufficient balance", async function () {
      // Deploy a fresh contract with NO ETH funding
      const CourseReward = await ethers.getContractFactory("CourseReward");
      const emptyContract = await CourseReward.deploy(rewardAmount, deadline, {
        value: 0,
      });
      await emptyContract.waitForDeployment();

      await emptyContract.addToWhitelist(student1.address);

      await expect(
        emptyContract.connect(student1).claim()
      ).to.be.revertedWith("Insufficient balance");
    });
  });

  // ─── Deadline ─────────────────────────────────────────────────
  describe("Deadline", function () {
    it("should reject claim after deadline has passed", async function () {
      await courseReward.addToWhitelist(student1.address);

      await ethers.provider.send("evm_increaseTime", [86401]); // skip 24h+1s
      await ethers.provider.send("evm_mine");

      await expect(
        courseReward.connect(student1).claim()
      ).to.be.revertedWith("Deadline passed");
    });
  });

  // ─── Withdraw ─────────────────────────────────────────────────
  // ✅ NEW describe block — covers lines 60, 61, 62, 63
  describe("Withdraw", function () {
    it("should allow owner to withdraw contract balance", async function () {
      const ownerBefore = await ethers.provider.getBalance(owner.address);
      const contractBalance = await courseReward.getBalance();

      const tx = await courseReward.withdraw();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const ownerAfter = await ethers.provider.getBalance(owner.address);

      // owner balance increased by (contractBalance - gas)
      expect(ownerAfter).to.equal(ownerBefore + contractBalance - gasUsed);
    });

    it("should set contract balance to zero after withdraw", async function () {
      await courseReward.withdraw();
      expect(await courseReward.getBalance()).to.equal(0);
    });

    it("should reject withdraw when contract balance is zero", async function () {
      await courseReward.withdraw(); // drain it first
      await expect(courseReward.withdraw()).to.be.revertedWith(
        "Nothing to withdraw"
      );
    });

    it("should reject non-owner from withdrawing", async function () {
      await expect(
        courseReward.connect(stranger).withdraw()
      ).to.be.revertedWith("Only owner can call this");
    });
  });

  // ─── getBalance ───────────────────────────────────────────────
  // ✅ NEW — covers line 68
  describe("getBalance", function () {
    it("should return the correct contract balance", async function () {
      const balance = await courseReward.getBalance();
      expect(balance).to.equal(ethers.parseEther("1.0"));
    });

    it("should reflect balance after a student claims", async function () {
      await courseReward.addToWhitelist(student1.address);
      await courseReward.connect(student1).claim();

      const balance = await courseReward.getBalance();
      expect(balance).to.equal(ethers.parseEther("1.0") - rewardAmount);
    });
  });
});