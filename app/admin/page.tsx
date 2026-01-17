"use client";

import { useAdminStats } from "@/hooks/useApi";
import { Users, Trophy, Activity, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
    const { data: stats, isLoading, error } = useAdminStats();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F2854]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-500 rounded-xl border border-red-200">
                Failed to load stats. Please ensure you are an admin.
            </div>
        );
    }

    const statCards = [
        {
            label: "Total Users",
            value: stats?.total_users || 0,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-50",
        },
        {
            label: "Total Submissions",
            value: stats?.total_submissions || 0,
            icon: Trophy,
            color: "text-yellow-500",
            bg: "bg-yellow-50",
        },
        {
            label: "Active Users (7d)",
            value: stats?.active_users_7d || 0,
            icon: Activity,
            color: "text-green-500",
            bg: "bg-green-50",
        },
        {
            label: "Conversion Rate",
            value: `${((stats?.active_users_7d || 0) / (stats?.total_users || 1) * 100).toFixed(1)}%`,
            icon: TrendingUp,
            color: "text-purple-500",
            bg: "bg-purple-50",
        },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-black text-[#0F2854]">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="bg-white p-6 rounded-2xl border-2 border-[#E5E5EA] shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <Icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </div>
                            <p className="text-gray-500 font-medium text-sm text-transform uppercase tracking-wider">{stat.label}</p>
                            <p className="text-3xl font-black text-[#0F2854] mt-1">{stat.value}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
