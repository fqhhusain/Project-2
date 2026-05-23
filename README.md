# Course Reward System

## Deskripsi

Smart contract untuk sistem reward mahasiswa yang menyelesaikan kursus. Dosen (owner) dapat mengatur jumlah reward dan whitelist mahasiswa yang berhak claim. Mahasiswa yang sudah di-whitelist dapat melakukan claim reward berupa ETH satu kali sebelum deadline.

## Anggota Kelompok

- Muhammad Faqih Husain (5027231023)

## Fitur

- Owner (dosen) bisa set reward amount
- Owner bisa whitelist mahasiswa yang boleh claim
- Mahasiswa bisa claim reward sekali saja
- Tracking siapa saja yang sudah claim
- Deadline claim — tidak bisa claim setelah batas waktu 7 hari
- Event logging untuk setiap aksi penting
- Owner bisa withdraw sisa dana kontrak

## Cara Menjalankan

### Prerequisites

- Node.js v18+
- npm

### Installation

```bash
npm install
```

### Compile

```bash
npx hardhat compile
```

### Test

```bash
npx hardhat test
```

### Deploy (Local)

Terminal 1 — jalankan local blockchain:
```bash
npx hardhat node
```

Terminal 2 — deploy contract:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### Interact (Opsional)

Edit `CONTRACT_ADDRESS` di `scripts/interact.js` dengan alamat hasil deploy, lalu:
```bash
npx hardhat run scripts/interact.js --network localhost
```

## Contract Address

```
0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

## Struktur Contract

| Komponen | Detail |
|---|---|
| State Variables | `owner`, `rewardAmount`, `deadline`, `hasClaimed`, `whitelist` |
| Functions | `setRewardAmount`, `addToWhitelist`, `claim`, `withdraw`, `getBalance` |
| Modifiers | `onlyOwner` |
| Events | `RewardClaimed`, `RewardAmountChanged`, `StudentWhitelisted` |
| Mappings | `hasClaimed`, `whitelist` |

## Screenshot / Bukti

### Compile
![alt text](image.png)
### Test and coverage
```
npx hardhat coverage

Version
=======
> solidity-coverage: v0.8.17

Instrumenting for coverage...
=============================

> CourseReward.sol

Compilation:
============

Nothing to compile

Network Info
============
> HardhatEVM: v2.28.6
> network:    hardhat



  CourseReward
    Deployment
      ✔ should set the correct owner
      ✔ should initialize with correct reward amount and deadline
    Whitelist
      ✔ should allow owner to whitelist a student
      ✔ should reject non-owner from whitelisting
    Set Reward Amount
      ✔ should allow owner to change reward amount
      ✔ should emit RewardAmountChanged event
      ✔ should reject non-owner from changing amount
    Claim
      ✔ should allow whitelisted student to claim and receive ETH
      ✔ should mark student as claimed after claiming
      ✔ should emit RewardClaimed event
      ✔ should reject double claim
      ✔ should reject non-whitelisted student
      ✔ should reject claim when contract has insufficient balance
    Deadline
      ✔ should reject claim after deadline has passed
    Withdraw
      ✔ should allow owner to withdraw contract balance
      ✔ should set contract balance to zero after withdraw
      ✔ should reject withdraw when contract balance is zero
      ✔ should reject non-owner from withdrawing
    getBalance
      ✔ should return the correct contract balance
      ✔ should reflect balance after a student claims


  20 passing (341ms)

-------------------|----------|----------|----------|----------|----------------|
File               |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-------------------|----------|----------|----------|----------|----------------|
 contracts/        |      100 |    90.91 |      100 |      100 |                |
  CourseReward.sol |      100 |    90.91 |      100 |      100 |                |
-------------------|----------|----------|----------|----------|----------------|
All files          |      100 |    90.91 |      100 |      100 |                |
-------------------|----------|----------|----------|----------|----------------|

> Istanbul reports written to ./coverage/ and ./coverage.json
```
### Deploy
![alt text](image-2.png)

![alt text](image-3.png)
### Metamask

![alt text](image-4.png)

![alt text](image-7.png)
### Transaksi

![alt text](image-6.png)