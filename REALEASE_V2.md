# SpeedrunSui API Documentation (v1)

> **Base URL:** `https://0exar5ldpd.execute-api.us-east-1.amazonaws.com`

This documentation covers all public and protected endpoints for the SpeedrunSui platform.

## 🔐 Authentication

All authenticated requests must include the `Authorization` header:
`Authorization: Bearer <your_jwt_token>`

### 1. Get Nonce
Start the sign-in flow by requesting a nonce for the user's wallet address.

**Endpoint:** `POST /auth/nonce`

**Request:**
```json
{
  "address": "0xa1b2c3d4e5f6..."
}
```

**Response (200 OK):**
```json
{
  "nonce": "Login to SpeedrunSui: a1b2c3d4...", 
  "message": "Login to SpeedrunSui: a1b2c3d4..."
}
```

### 2. Sign In
Exchange the signed message for a JWT token.

**Endpoint:** `POST /auth/sign-in`

**Request:**
```json
{
  "address": "0xa1b2c3d4e5f6...",
  "nonce": "Login to SpeedrunSui: a1b2c3d4...",
  "message": "Login to SpeedrunSui: a1b2c3d4...", 
  "signature": "AaBbCcDd..." // Base64 signature from wallet
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1Ni...",
  "address": "0xa1b2c3d4e5f6...",
  "is_admin": false
}
```

### 3. Get Current User Status
Check if the current session is valid and if the user is an admin.

**Endpoint:** `GET /auth/me`
**Auth:** Required 🔒

**Response (200 OK):**
```json
{
  "address": "0xa1b2c3d4e5f6...",
  "is_admin": true
}
```

---

## 👤 Builder Profile

### 1. Get Builder Profile
Fetch public profile information, including completed challenges, NFTs, and stats.

**Endpoint:** `GET /builders/{address}`
**Auth:** Open (Public)

**Response (200 OK):**
```json
{
  "address": "0xa1b2c3d4e5f6...",
  "total_xp": 450,
  "level": 3,
  "completed_challenges": ["1", "2"],
  "nfts": [
    {
      "object_id": "0x...",
      "name": "Speedrun Hero #1",
      "image_url": "https://..."
    }
  ],
  "sui_ns": {
    "name": "builder.sui",
    "object_id": "0x..."
  },
  "socials": {
    "twitter": "sui_builder",
    "github": "builder_gh"
  },
  "location": {
    "city": "New York",
    "country": "USA"
  },
  "created_at": 1678886400,
  "updated_at": 1678972800
}
```

### 2. Update Profile
Update optional profile fields like socials and location.

**Endpoint:** `PUT /profile`
**Auth:** Required 🔒

**Request:**
```json
{
  "socials": {
    "twitter": "new_handle",
    "github": "gh_user",
    "telegram": "tele_user",
    "discord": "discord#1234"
  },
  "location": {
    "city": "San Francisco",
    "country": "USA"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ...updated_profile_object... }
}
```

---

## 🏆 Challenges

### 1. List All Challenges
Get the list of active challenges with their metadata and submission stats.

**Endpoint:** `GET /v1/challenges`
**Auth:** Open (Public)

**Response (200 OK):**
```json
{
  "data": [
    {
      "challenge_id": "1",
      "title": "Hello Sui",
      "description": "# Markdown Content...",
      "image_url": "https://s3...",
      "xp_reward": 100,
      "difficulty": "EASY",
      "submission_count": 42,
      "tags": ["move", "basics"]
    },
    ...
  ]
}
```

### 2. Get Single Challenge
**Endpoint:** `GET /v1/challenges/{id}`
**Auth:** Open (Public)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "challenge_id": "1",
    "title": "Hello Sui",
    // ... same structure as list item
    "submission_count": 42
  }
}
```

### 3. Verify Challenge Submission
Submit a transaction digest for verification to earn XP.

**Endpoint:** `POST /v1/verify-challenge`
**Auth:** Required 🔒

**Request:**
```json
{
  "user_address": "0xa1b2c3...",
  "package_id": "0xpkg...",
  "tx_digest": "BiZb...",
  "challenge_id": "1"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Challenge verified successfully!",
  "xp_earned": 100
}
```

**Response (400 Bad Request - Error):**
```json
{
  "success": false,
  "error": "VERIFICATION_FAILED",
  "message": "Module 'hello_world' not found in package"
}
```

---

## 🛠️ Admin API

**Note:** All Admin endpoints require **JWT Authentication** (`Authorization: Bearer <token>`) AND the authenticated wallet must be in the `ADMIN_ADDRESSES` whitelist. The old `x-api-key` header is **deprecated**.

### 1. Get Platform Stats
**Endpoint:** `GET /admin/stats`

**Response:**
```json
{
  "total_users": 150,
  "total_submissions": 320,
  "active_users_7d": 45
}
```

### 2. Get Upload URL (S3)
Get a presigned URL to upload images for challenge content.

**Endpoint:** `POST /admin/upload-url`

**Request:**
```json
{
  "file_name": "hero-image.png",
  "content_type": "image"
}
```

**Response:**
```json
{
  "upload_url": "https://s3.amazonaws.com/...",
  "public_url": "https://suispeedrun-challenges.s3..."
}
```

### 3. Create Challenge
**Endpoint:** `POST /admin/challenges`

**Request:**
```json
{
  "challenge_id": "new-1",
  "title": "New Challenge",
  "description": "# Markdown...",
  "xp_reward": 500,
  "difficulty": "HARD",
  "required_modules": ["mod1"],
  "tags": ["defi"]
}
```
