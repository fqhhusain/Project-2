const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with account:", deployer.address);
  console.log(
    "Account balance:",
    ethers.formatEther(await ethers.provider.getBalance(deployer.address)),
    "ETH"
  );

  const rewardAmount = ethers.parseEther("0.1");           // 0.1 ETH per student
  const deadline = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days

  const CourseReward = await ethers.getContractFactory("CourseReward");
  const courseReward = await CourseReward.deploy(rewardAmount, deadline, {
    value: ethers.parseEther("1.0"), // fund contract with 1 ETH (covers 10 students)
  });

  await courseReward.waitForDeployment();

  const address = await courseReward.getAddress();

  console.log("\n✅ CourseReward deployed!");
  console.log("   Contract address :", address);
  console.log("   Reward per student:", ethers.formatEther(rewardAmount), "ETH");
  console.log("   Deadline          :", new Date(deadline * 1000).toLocaleString());
  console.log("   Contract balance  :", ethers.formatEther(await ethers.provider.getBalance(address)), "ETH");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
