const { ethers } = require("hardhat");

// Paste your deployed contract address here after running deploy.js
const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

async function main() {
  const [owner, student1, student2] = await ethers.getSigners();
  const courseReward = await ethers.getContractAt("CourseReward", CONTRACT_ADDRESS);

  console.log("=== CourseReward Interaction Script ===\n");

  // 1. Check initial state
  console.log("Owner          :", await courseReward.owner());
  console.log("Reward amount  :", ethers.formatEther(await courseReward.rewardAmount()), "ETH");
  console.log("Contract balance:", ethers.formatEther(await courseReward.getBalance()), "ETH\n");

  // 2. Owner whitelists students
  console.log("Whitelisting students...");
  await (await courseReward.addToWhitelist(student1.address)).wait();
  await (await courseReward.addToWhitelist(student2.address)).wait();
  console.log("✅ Student1 whitelisted:", student1.address);
  console.log("✅ Student2 whitelisted:", student2.address, "\n");

  // 3. Students claim reward
  console.log("Student1 claiming reward...");
  await (await courseReward.connect(student1).claim()).wait();
  console.log("✅ Student1 claimed!\n");

  // 4. Final state
  console.log("=== Final State ===");
  console.log("Contract balance :", ethers.formatEther(await courseReward.getBalance()), "ETH");
  console.log("Student1 claimed :", await courseReward.hasClaimed(student1.address));
  console.log("Student2 claimed :", await courseReward.hasClaimed(student2.address));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
