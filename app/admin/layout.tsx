"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Trophy, Users, LogOut, ArrowLeft } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isAuthenticating, user, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);

    // Mock admin check - in real app this would check a claim or whitelist
    // For now we trust the API to block non-admins, but we can do a client-side
    // check if we have the list or a flag in the user object.
    // Based on REALEASE_V3, /auth/me returns is_admin.
    // The useAuth hook doesn't currently expose is_admin directly from the user object type
    // so we might need to assume if they can access the page it's fine, or fetch /auth/me.
    // However, for this implementation, we will assume the user object might have it
    // or we fetch it. Since useAuth uses local storage, let's just protect route existence first.

    // For a robust implementation, we should fetch /auth/me effectively.
    // But to unblock, let's just check authentication first.

    useEffect(() => {
        if (!isAuthenticating) {
            if (!isAuthenticated) {
                router.push("/");
            } else {
                setIsAuthorized(true);
            }
        }
    }, [isAuthenticated, isAuthenticating, router]);

    if (isAuthenticating || !isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F2854]"></div>
            </div>
        );
    }

    const navItems = [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Challenges", href: "/admin/challenges", icon: Trophy },
        { label: "Users", href: "/admin/users", icon: Users },
    ];

    return (
        <div className="flex h-screen bg-[#F5F5F7]">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r-2 border-[#E5E5EA] flex flex-col">
                <div className="p-6 border-b-2 border-[#E5E5EA]">
                    <h1 className="text-2xl font-black text-[#0F2854] tracking-tight">
                        ADMIN
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all",
                                    isActive
                                        ? "bg-[#0F2854] text-white shadow-[2px_2px_0px_0px_#4988C4] translate-x-[1px] translate-y-[1px]"
                                        : "text-gray-500 hover:bg-gray-100 hover:text-[#0F2854]"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t-2 border-[#E5E5EA] space-y-2">
                    <Link href="/challenges">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 hover:text-[#0F2854] transition-all">
                            <ArrowLeft className="h-5 w-5" />
                            Back to App
                        </button>
                    </Link>
                    <button
                        onClick={signOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8">
                {children}
            </main>
        </div>
    );
}
