const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Challenge {
    challenge_id: string;
    title: string;
    description: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    xp_reward: number;
    image_url: string;
    required_modules: string[];
    status?: "locked" | "open" | "completed"; // Add status for frontend matching
}

interface AuthResponse {
    token: string;
    address: string;
}

export const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null;
export const setToken = (token: string) => typeof window !== 'undefined' && localStorage.setItem('jwt_token', token);
export const removeToken = () => typeof window !== 'undefined' && localStorage.removeItem('jwt_token');

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.message || error.error || 'API request failed');
    }

    const result = await response.json();
    return result.data !== undefined ? result.data : result;
}

export async function getNonce(address: string): Promise<{ nonce: string, message: string }> {
    return apiFetch('/auth/nonce', {
        method: 'POST',
        body: JSON.stringify({ address }),
    });
}

export async function signIn(payload: { address: string, nonce: string, message: string, signature: string }): Promise<AuthResponse> {
    return apiFetch('/auth/sign-in', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export async function getChallenges(): Promise<Challenge[]> {
    return apiFetch('/v1/challenges');
}

export async function getBuilderProfile(address: string): Promise<any> {
    return apiFetch(`/builders/${address}`);
}
