const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Challenge {
    challenge_id: string;
    title: string;
    description: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    xp_reward: number;
    image_url: string;
    required_modules: string[];
    status?: "locked" | "open" | "completed";
    instructions?: string; // Markdown content
}

export interface BuilderProfile {
    address: string;
    total_xp: number;
    level: number;
    completed_challenges: string[];
    nfts: {
        object_id: string;
        name: string;
        image_url: string;
    }[];
    sui_ns?: {
        name: string;
        object_id: string;
    };
    socials?: {
        twitter?: string;
        github?: string;
        telegram?: string;
        discord?: string;
    };
    location?: {
        city?: string;
        country?: string;
    };
    created_at?: number;
    updated_at?: number;
    joinedDate?: string; // Client-side mapping often uses this, keeping for compatibility if utilized
}

interface AuthResponse {
    token: string;
    address: string;
    is_admin: boolean;
}

export const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null;
export const setToken = (token: string) => typeof window !== 'undefined' && localStorage.setItem('jwt_token', token);
export const removeToken = () => typeof window !== 'undefined' && localStorage.removeItem('jwt_token');

export async function getMe(): Promise<{ address: string; is_admin: boolean }> {
    return apiFetch('/auth/me');
}

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

export async function getChallenge(id: string): Promise<Challenge> {
    return apiFetch(`/v1/challenges/${id}`);
}

export async function getBuilderProfile(address: string): Promise<BuilderProfile> {
    return apiFetch(`/builders/${address}`);
}

export async function updateProfile(payload: { socials?: any; location?: any }): Promise<any> {
    return apiFetch('/profile', {
        method: 'PUT',
        body: JSON.stringify(payload),
    });
}

export interface LeaderboardResponse {
    leaderboard: BuilderProfile[];
    cursor?: string;
}

export async function verifyChallenge(payload: { user_address: string, package_id: string, tx_digest: string, challenge_id: string }): Promise<any> {
    return apiFetch('/v1/verify-challenge', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export async function getLeaderboard(limit: number = 50, cursor?: string): Promise<LeaderboardResponse> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (cursor) {
        params.append('cursor', cursor);
    }
    return apiFetch(`/leaderboard?${params.toString()}`);
}

// Admin Types
export interface AdminStats {
    total_users: number;
    total_submissions: number;
    active_users_7d: number;
}

export interface UploadUrlResponse {
    upload_url: string;
    public_url: string;
}

export interface UserListResponse {
    users: BuilderProfile[];
    count: number;
}

// Admin API
export async function getAdminStats(): Promise<AdminStats> {
    return apiFetch('/admin/stats');
}

export async function getUploadUrl(fileName: string, contentType: string): Promise<UploadUrlResponse> {
    return apiFetch('/admin/upload-url', {
        method: 'POST',
        body: JSON.stringify({ file_name: fileName, content_type: contentType }),
    });
}

export async function createChallenge(challenge: Partial<Challenge>): Promise<Challenge> {
    return apiFetch('/admin/challenges', {
        method: 'POST',
        body: JSON.stringify(challenge),
    });
}

export async function updateChallenge(id: string, challenge: Partial<Challenge>): Promise<Challenge> {
    return apiFetch(`/admin/challenges/${id}`, {
        method: 'PUT',
        body: JSON.stringify(challenge),
    });
}

export async function deleteChallenge(id: string): Promise<void> {
    return apiFetch(`/admin/challenges/${id}`, {
        method: 'DELETE',
    });
}

export async function getUsers(limit: number = 50, cursor?: string): Promise<UserListResponse> {
    return apiFetch('/admin/users');
}

// IDE API
export interface CompileRequest {
    files: Record<string, string>; // filename -> content
}

export interface CompileResponse {
    success: boolean;
    data?: {
        modules: string[];
        dependencies: string[];
        digest: number[];
    };
    bytecode?: string; // Keeping for backward compatibility if needed, but usage guide suggests data.modules
    error?: string;
}

export async function compileCode(files: Record<string, string>): Promise<CompileResponse> {
    const response = await fetch(`${API_URL}/ide/compile`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Compilation failed' }));
        return {
            success: false,
            bytecode: '',
            error: error.error || error.message || 'Compilation failed'
        };
    }

    return response.json();
}

export interface TestResponse {
    output: string;
    error?: string;
}

export async function runTest(files: Record<string, string>): Promise<TestResponse> {
    const response = await fetch(`${API_URL}/ide/test`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Test execution failed' }));
        return {
            output: '',
            error: error.error || error.message || 'Test execution failed'
        };
    }

    const result = await response.json();
    return {
        output: result.data?.output || result.output || '', // Handle varied response formats
        error: undefined
    };
}

export interface IDEProject {
    id?: string;
    name: string;
    description?: string;
    files: Record<string, string>;
    challenge_id?: string;
    created_at?: number;
    updated_at?: number;
}

export async function saveProject(project: IDEProject): Promise<IDEProject> {
    return apiFetch('/ide/project', {
        method: 'POST',
        body: JSON.stringify(project),
    });
}

export async function getProject(id: string): Promise<IDEProject> {
    return apiFetch(`/ide/project?id=${id}`);
}

export async function listProjects(): Promise<IDEProject[]> {
    return apiFetch('/ide/projects');
}
