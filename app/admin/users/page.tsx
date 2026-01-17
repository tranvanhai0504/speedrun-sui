"use client";

import { useAdminUsers } from "@/hooks/useApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function UsersAdminPage() {
    const { data, isLoading } = useAdminUsers();
    const [searchTerm, setSearchTerm] = useState("");

    // Simple client-side search for now since API doesn't support search param yet
    const filteredUsers = data?.users.filter(user =>
        user.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.sui_ns?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.socials?.twitter?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-[#0F2854]">Users</h1>
                <p className="text-gray-500">View registered builders</p>
            </div>

            <div className="bg-white rounded-xl border-2 border-[#E5E5EA] overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by address, name, twitter..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 border-gray-200"
                        />
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                        Total Users: {data?.count || 0}
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-8 text-center">Loading users...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50">
                                <tr className="text-gray-500 font-bold uppercase text-xs tracking-wider">
                                    <th className="px-6 py-4">Builder</th>
                                    <th className="px-6 py-4">Level / XP</th>
                                    <th className="px-6 py-4">Challenges</th>
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4">Location</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers?.map((user) => (
                                    <tr key={user.address} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border border-gray-200">
                                                    <AvatarImage src={`https://avatars.dicebear.com/api/pixel-art/${user.address}.svg`} />
                                                    <AvatarFallback>{user.address.slice(0, 2)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-bold text-[#0F2854]">
                                                        {user.sui_ns?.name || `${user.address.slice(0, 6)}...${user.address.slice(-4)}`}
                                                    </div>
                                                    {user.socials?.twitter && (
                                                        <div className="text-xs text-blue-500">@{user.socials.twitter}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold">Lvl {user.level}</div>
                                            <div className="text-xs text-gray-500">{user.total_xp} XP</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                                                {user.completed_challenges?.length || 0} Completed
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {user.created_at ? format(new Date(user.created_at * 1000), 'MMM d, yyyy') : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {user.location?.city ? `${user.location.city}, ${user.location.country}` : '-'}
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers?.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
