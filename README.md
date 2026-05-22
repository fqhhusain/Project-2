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
### Test
![alt text](image-1.png)
### Deploy
![alt text](image-2.png)

![alt text](image-3.png)
### Metamask

![alt text](image-4.png)

![alt text](image-7.png)
### Transaksi

![alt text](image-6.png)