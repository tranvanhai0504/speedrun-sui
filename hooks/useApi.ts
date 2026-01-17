import { useQuery, useMutation } from "@tanstack/react-query";
import { getChallenges, getChallenge, getBuilderProfile, verifyChallenge, updateProfile, getLeaderboard } from "@/lib/api";

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
