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
   git clone https://github.com/yourusername/libre.git
   cd libre
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. Start the development server:
   ```
   cd api
   npm run dev
   cd client
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

1. Run `node deploy-contracts.js` to deploy all contracts to the Stacks network.

2. Update the .env file with the newly deployed contract addresses.

3. Run `node setup-script.js` to initialize the contracts with correct parameters and permissions.

4. Run the Clarinet tests to ensure basic functionality is working as expected.

```
cd contracts
clarinet test tests/libre-test.ts
clarinet test tests/price-oracle-test.ts
```

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

## OPUS Calculation

The Libre token price is calculated using the OPUS oracle. The OPUS oracle is a price oracle that provides price data for a variety of assets. The Libre token price is calculated using the following formula:

```
Libre Price = 100 * (1 + (OPUS Price - 1) / 2)
``` 

How this number was calculated:
The Bureau of Labor Statistics (BLS) maintains the CPI. They collect price data for a basket of goods and services in 75 urban areas across the country and from about 23,000 retail and service establishments. Housing price data is collected from about 50,000 landlords or tenants. The CPI is then calculated by comparing the cost of this fixed basket of goods and services between two periods.

To get our specific ratio, I used the BLS inflation calculator, inputting $1 for January 2009 and calculating its equivalent value for August 2024 (the latest available data as of my knowledge cutoff). The result shows how much the purchasing power of the dollar has changed over this period due to inflation.

It's important to note that this is an average measure and may not reflect the exact price changes for specific goods or in all locations. Additionally, please be aware that my knowledge cutoff is in April 2024, so for the most up-to-date and accurate information, you should check the BLS website directly.

## Staking

Users can stake their Libre tokens to receive staking rewards. The staking rewards are distributed to users based on the amount of Libre tokens they have staked. The staking rewards are distributed every 24 hours.

## Withdrawals

Users can withdraw their staked Libre tokens at any time. The staked Libre tokens are burned and the user's balance is updated accordingly.
