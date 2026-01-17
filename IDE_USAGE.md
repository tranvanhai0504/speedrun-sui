# Web IDE Usage Guide

## 📦 Move.toml Configuration

The compiler Lambda is smart! You can use **standard Move.toml** configuration. The backend will automatically detect the `Sui` dependency and map it to the local pre-installed framework for speed (~3s build time).

### ✅ Recommended Format (Standard)

You can use the standard Git dependency format. The backend will **automatically rewrite** it to use the local optimized path.

```toml
[package]
name = "YourPackage"
version = "0.0.1"
edition = "2024.alpha"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }

[addresses]
your_package = "0x0"
```

### ⚡ Optimized Format (Manual Override)

If you want to be explicit, you can still use the local path:

```toml
[dependencies]
Sui = { local = "/sui-packages/sui-framework" }
```

## API Endpoints

### 1. Compile (`POST /ide/compile`)

Compiles the Move code and returns bytecode suitable for client-side signing.

**Request:**
```json
{
  "files": {
    "Move.toml": "...",
    "sources/module.move": "..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "modules": ["<base64_bytecode>", ...],
    "dependencies": ["0x...", ...],
    "digest": [123, 45, ...]
  }
}
```

### 2. Run Tests (`POST /ide/test`)

Runs unit tests (`sui move test`) and returns output logs.

**Response:**
```json
{
  "success": true,
  "data": {
    "output": "INCLUDING DEPENDENCY Sui\n... [ PASS ] test_case ..."
  }
}
```

### 3. Project Management (`/ide/project`)

Endpoints to save and load user projects. **Requires Authentication (Bearer Token)**.

- **Save**: `POST /ide/project` with body `{ "challenge_id": "...", "files": {...} }`
- **Load**: `GET /ide/project?challenge_id=...`

## 🚀 Client-Side Deployment (Recommended)

To deploy without sharing your private key with the server, use the **Sui dApp Kit** or **Sui SDK** on the frontend.

### Step 1: Compile
Call `/ide/compile` to get the module bytecode and dependency IDs.

### Step 2: Sign & Publish (Frontend Code)

```typescript
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';

// ... inside your component
const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

async function handleDeploy() {
  // 1. Compile
  const compileRes = await fetch('https://API/ide/compile', { ... });
  const { modules, dependencies } = compileRes.data;

  // 2. Construct Transaction
  const tx = new TransactionBlock();
  const [upgradeCap] = tx.publish({
    modules: modules.map(m => Array.from(atob(m), c => c.charCodeAt(0))), // Convert Base64 to number[]
    dependencies: dependencies,
  });
  
  // Transfer UpgradeCap to sender
  tx.transferObjects([upgradeCap], tx.pure(userAddress));

  // 3. Sign & Execute
  signAndExecute(
    { transactionBlock: tx },
    {
      onSuccess: (result) => {
        console.log('Deployed! Digest:', result.digest);
      },
    }
  );
}
```

## Troubleshooting

- **"FETCHING GIT DEPENDENCY"**: This usually means the auto-fix failed. Check your matching regex.
- **"edition 2024.beta not supported"**: Change to `2024.alpha`.
