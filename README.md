# Libre

## Overview

Libre is a decentralized finance (DeFi) project built on the Stacks blockchain, aiming to provide a stable cryptocurrency that automatically adjusts its supply to maintain a target price. The project incorporates advanced rebasing mechanisms, staking rewards, and seamless integration with the Stacks ecosystem.

### Key Features

- Algorithmic stability mechanism
- Automatic rebasing without user intervention
- Staking and rewards system
- Integration with Leather wallet
- Support for STX and sBTC deposits

## Technical Stack

### Frontend
- Next.js
- React
- Chakra UI
- Stacks.js libraries

### Backend
- Node.js
- Express.js

### Blockchain
- Clarity smart contracts
- Stacks blockchain

## Installation and Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/algostable.git
   cd algostable
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Smart Contracts

### Libre Token Contract
- **Purpose**: Manages the Libre token (Libre)
- **Key Functions**:
  - `transfer`: Allows token transfers between addresses
  - `mint`: Creates new tokens (controlled by governance)
  - `burn`: Destroys tokens (controlled by governance)
  - `rebase`: Adjusts total supply based on price oracle data

### Staking Pool Contract
- **Purpose**: Handles staking of Libre tokens
- **Key Functions**:
  - `stake`: Allows users to stake their Libre tokens
  - `unstake`: Allows users to withdraw their staked tokens
  - `claim-rewards`: Distributes staking rewards to users

### Rebase Controller Contract
- **Purpose**: Manages the rebasing mechanism
- **Key Functions**:
  - `check-rebase`: Determines if a rebase is necessary
  - `execute-rebase`: Performs the rebase operation
  - `set-target-price`: Updates the target price (governance function)

### Price Oracle Contract
- **Purpose**: Provides price data for the rebasing mechanism
- **Key Functions**:
  - `update-price`: Updates the current price of Libre
  - `get-price`: Retrieves the current price

## API Endpoints

- `GET /api/price`: Retrieves current Libre price
- `GET /api/total-supply`: Fetches total supply of Libre
- `GET /api/staking-stats`: Provides staking statistics
- `GET /api/balance/:address`: Retrieves Libre balance for a given address
- `POST /api/deposit`: Handles asset deposits
- `POST /api/withdraw`: Processes withdrawal requests
- `GET /api/deposits/:address`: Fetches deposit history for an address
- `GET /api/rebase-history/:address`: Retrieves rebase history for an address

## User Flow

1. User connects their Leather wallet to the dApp
2. User deposits STX or sBTC
3. User receives a proportional amount of Libre tokens
4. Rebasing occurs automatically, adjusting user's Libre balance without requiring signatures