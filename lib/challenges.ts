export type ChallengeStatus = "locked" | "open" | "completed";

export interface Challenge {
    id: number;
    title: string;
    description: string;
    instructions: string; // Markdown content
    status: ChallengeStatus;
    difficulty: "Easy" | "Medium" | "Hard";
}

export const challenges: Challenge[] = [
    {
        id: 0,
        title: "Simple Greeting",
        description: "Introduction to Sui Objects. Deploy your first Move contract that says hello.",
        instructions: `
# Challenge 0: Simple Greeting

Welcome to Speedrun Sui! Your first task is to get familiar with Move objects.

## Objective
Write a simple module that defines a \`Greeting\` object and a function to create it.

## Requirements
1. Define a struct \`Greeting\` with a \`UID\` and a \`string\` field.
2. Create a public entry function \`mint_greeting\` that transfers a new \`Greeting\` to the sender.
3. Deploy the package to Testnet.

## Resources
- [Sui Move Intro](https://docs.sui.io/guides/developer/sui-101/create-coin)
- [Move Book](https://move-book.com/)
    `,
        status: "open",
        difficulty: "Easy",
    },
    {
        id: 1,
        title: "Managed Coin",
        description: "Learn about Treasury Caps. Create a coin that you can mint and burn.",
        instructions: `
# Challenge 1: Managed Coin

Time to make some money (testnet money, that is).

## Objective
Create a standard Coin implementation with a TreasuryCap governed by the deployer.

## Requirements
1. Use the One-Time-Witness pattern.
2. Implement \`mint\` and \`burn\` functions.
3. Transfer the \`TreasuryCap\` to your address upon deployment.

## Resources
- [Sui Coin Standard](https://docs.sui.io/standards/coin)
    `,
        status: "locked",
        difficulty: "Medium",
    },
    {
        id: 2,
        title: "Decentralized Marketplace",
        description: "Understand Shared Objects & Kiosk. trade items trustlessly.",
        instructions: "To be implemented...",
        status: "locked",
        difficulty: "Hard",
    },
    {
        id: 3,
        title: "PTB Master",
        description: "Programmable Transaction Blocks. Execute complex logic in a single tx.",
        instructions: "To be implemented...",
        status: "locked",
        difficulty: "Hard",
    },
];
