"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wallet, LogOut, User, Copy, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserMenuProps {
    address: string;
    onSignOut: () => void;
    actionLabel: string;
    buttonBgColor?: string;
    buttonTextColor?: string;
    isAdmin?: boolean;
}

export function UserMenu({ address, onSignOut, actionLabel, buttonBgColor = "#BDE8F5", buttonTextColor = "#0F2854", isAdmin = false }: UserMenuProps) {
    const router = useRouter();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(address);
        // Could add a toast notification here
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="card-nav-cta-button hidden md:inline-flex border-2 border-[#0F2854] shadow-[2px_2px_0px_0px_#0F2854] rounded-[calc(0.75rem-0.2rem)] px-4 items-center gap-2 h-full font-bold cursor-pointer transition-all duration-300 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-[2px] active:translate-y-[10px] outline-none"
                    style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
                >
                    <Wallet className="h-4 w-4" />
                    {actionLabel}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-42 border-2 border-[#0F2854] shadow-[4px_4px_0px_0px_#0F2854] rounded-xl bg-white p-2 mt-3" align="end">
                <DropdownMenuLabel className="font-bold text-[#0F2854]">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#0F2854]/20" />
                <DropdownMenuItem
                    onClick={() => router.push(`/builder/${address}`)}
                    className="cursor-pointer font-medium text-[#0F2854] hover:bg-secondary/20 hover:text-[#0F2854] focus:bg-secondary/20 focus:text-[#0F2854]"
                >
                    <User className="mr-2 h-4 w-4" />
                    <span>Portfolio</span>
                </DropdownMenuItem>
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => router.push("/admin")}
                        className="cursor-pointer font-medium text-[#0F2854] hover:bg-secondary/20 hover:text-[#0F2854] focus:bg-secondary/20 focus:text-[#0F2854]"
                    >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Admin</span>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem
                    onClick={copyToClipboard}
                    className="cursor-pointer font-medium text-[#0F2854] hover:bg-secondary/20 hover:text-[#0F2854] focus:bg-secondary/20 focus:text-[#0F2854]"
                >
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Copy Address</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#0F2854]/20" />
                <DropdownMenuItem
                    onClick={onSignOut}
                    className="cursor-pointer font-medium text-red-600 hover:bg-red-50 focus:bg-red-50"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
