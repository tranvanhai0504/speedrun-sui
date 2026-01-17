import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChallenges, getChallenge, getBuilderProfile, verifyChallenge, updateProfile, getLeaderboard, getAdminStats, createChallenge, updateChallenge, deleteChallenge, getUsers } from "@/lib/api";

export function useChallenges() {
    return useQuery({
        queryKey: ["challenges"],
        queryFn: getChallenges,
        staleTime: 60 * 1000, // 1 minute
    });
}

export function useChallenge(id: string) {
    return useQuery({
        queryKey: ["challenge", id],
        queryFn: () => getChallenge(id),
        enabled: !!id,
    });
}

export function useBuilderProfile(address: string) {
    return useQuery({
        queryKey: ["builder", address],
        queryFn: () => getBuilderProfile(address),
        enabled: !!address,
    });
}

export function useVerifyChallenge() {
    return useMutation({
        mutationFn: verifyChallenge,
    });
}

export function useUpdateProfile() {
    return useMutation({
        mutationFn: updateProfile,
    });
}

export function useLeaderboard(limit: number = 50, cursor?: string) {
    return useQuery({
        queryKey: ["leaderboard", limit, cursor],
        queryFn: () => getLeaderboard(limit, cursor),
    });
}

export function useAdminStats() {
    return useQuery({
        queryKey: ["admin", "stats"],
        queryFn: getAdminStats,
    });
}

export function useAdminUsers() {
    return useQuery({
        queryKey: ["admin", "users"],
        queryFn: () => getUsers(),
    });
}

export function useAdminChallengeMutation() {
    const queryClient = useQueryClient();

    return {
        create: useMutation({
            mutationFn: createChallenge,
            onSuccess: () => queryClient.invalidateQueries({ queryKey: ["challenges"] }),
        }),
        update: useMutation({
            mutationFn: ({ id, data }: { id: string; data: any }) => updateChallenge(id, data),
            onSuccess: () => queryClient.invalidateQueries({ queryKey: ["challenges"] }),
        }),
        delete: useMutation({
            mutationFn: deleteChallenge,
            onSuccess: () => queryClient.invalidateQueries({ queryKey: ["challenges"] }),
        }),
    };
}
