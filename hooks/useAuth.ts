import { useCurrentAccount, useSignPersonalMessage } from "@mysten/dapp-kit";
import { useState, useEffect } from "react";
import { getNonce, signIn as apiSignIn, setToken, removeToken, getToken } from "@/lib/api";

export function useAuth() {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check if token exists
        if (getToken() && currentAccount) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [currentAccount]);

    const signIn = async () => {
        if (!currentAccount) return;

        setIsAuthenticating(true);
        setError(null);

        try {
            // 1. Get nonce
            const { nonce, message } = await getNonce(currentAccount.address);

            // 2. Sign message
            const result = await signPersonalMessage({
                message: new TextEncoder().encode(message),
            });

            // 3. Convert signature (dapp-kit returns object or string depending on version, ensuring base64)
            const signatureBase64 = result.signature; // In recent dapp-kit, it's usually already a base64 string

            // 4. Sign in
            const { token } = await apiSignIn({
                address: currentAccount.address,
                nonce,
                message,
                signature: signatureBase64,
            });

            // 5. Store token
            setToken(token);
            setIsAuthenticated(true);
        } catch (err: any) {
            console.error("Sign in failed:", err);
            setError(err.message || "Failed to sign in");
        } finally {
            setIsAuthenticating(false);
        }
    };

    const signOut = () => {
        removeToken();
        setIsAuthenticated(false);
    };

    return {
        isAuthenticated,
        isAuthenticating,
        signIn,
        signOut,
        error,
        user: currentAccount,
    };
}
