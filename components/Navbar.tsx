"use client";

import CardNav, { CardNavItem } from "@/components/CardNav";
import { useAuth } from "@/hooks/useAuth";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { UserMenu } from "@/components/UserMenu";

export function Navbar() {
    const { isAuthenticated, signIn, isAuthenticating, signOut, isAdmin } = useAuth();
    const currentAccount = useCurrentAccount();

    const navItems: CardNavItem[] = [
        {
            label: "Learn",
            bgColor: "#BDE8F5", // Pale Cyan
            textColor: "#0F2854", // Dark Blue
            links: [
                { label: "All Challenges", href: "/challenges", ariaLabel: "View all challenges", linkTarget: "_self" },
                { label: "Documentation", href: "#", ariaLabel: "Read documentation", linkTarget: "_self" },
                { label: "Tutorials", href: "#", ariaLabel: "Watch tutorials", linkTarget: "_self" },
            ],
        },
        {
            label: "Community",
            bgColor: "#4988C4", // Light Blue
            textColor: "#FFFFFF",
            links: [
                { label: "Leaderboard", href: "/leaderboard", ariaLabel: "View leaderboard", linkTarget: "_self" },
                { label: "Builders Directory", href: "#", ariaLabel: "Find other builders", linkTarget: "_blank" },
                { label: "Discord", href: "#", ariaLabel: "Join Discord", linkTarget: "_blank" },
            ],
        },
        {
            label: "Resources",
            bgColor: "#1C4D8D", // Medium Blue
            textColor: "#FFFFFF",
            links: [
                { label: "Sui Documentation", href: "https://docs.sui.io/guides", ariaLabel: "Official Sui Docs", linkTarget: "_blank" },
                { label: "Move Book", href: "https://move-book.com/", ariaLabel: "Move Language Book", linkTarget: "_blank" },
                { label: "Faucet", href: "https://faucet.sui.io/", ariaLabel: "Testnet Faucet", linkTarget: "_blank" },
            ],
        },
    ];

    let actionLabel = "Connect Wallet";
    let onAction = undefined;
    let customActionComponent = undefined;

    if (!currentAccount) {
        customActionComponent = (
            <ConnectButton
                className="!bg-[#BDE8F5] !text-[#0F2854] !font-bold !border-2 !border-[#0F2854] !shadow-[2px_2px_0px_0px_#0F2854] !rounded-xl !h-full !px-4 hover:!translate-x-[1px] hover:!translate-y-[1px] hover:!shadow-none transition-all"
            />
        );
    } else {
        if (isAuthenticated) {
            actionLabel = `${currentAccount.address.slice(0, 6)}...${currentAccount.address.slice(-4)}`;
            customActionComponent = (
                <UserMenu
                    address={currentAccount.address}
                    onSignOut={signOut}
                    actionLabel={actionLabel}
                    isAdmin={isAdmin}
                />
            );
        } else {
            actionLabel = isAuthenticating ? "Signing In..." : "Sign In";
            onAction = signIn;
        }
    }

    return (
        <CardNav
            items={navItems}
            baseColor="#FFFFFF"
            menuColor="#0F2854"
            buttonBgColor="#BDE8F5"
            buttonTextColor="#0F2854"
            actionLabel={actionLabel}
            onAction={onAction}
            customActionComponent={customActionComponent}
        />
    );
}
