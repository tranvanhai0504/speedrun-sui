import { useQuery, useMutation } from "@tanstack/react-query";
import { getChallenges, getBuilderProfile } from "@/lib/api";

export function useChallenges() {
    return useQuery({
        queryKey: ["challenges"],
        queryFn: getChallenges,
        staleTime: 60 * 1000, // 1 minute
    });
}

export function useBuilderProfile(address: string) {
    return useQuery({
        queryKey: ["builder", address],
        queryFn: () => getBuilderProfile(address),
        enabled: !!address,
    });
}
