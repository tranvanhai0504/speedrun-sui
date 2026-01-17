import { useCurrentAccount, useSignPersonalMessage, useDisconnectWallet } from "@mysten/dapp-kit";
import { useState, useEffect } from "react";
import { getNonce, signIn as apiSignIn, setToken, removeToken, getToken, getMe } from "@/lib/api";

export function useAuth() {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const { mutate: disconnect } = useDisconnectWallet();

    useEffect(() => {
        const checkAuth = async () => {
            setIsAuthenticating(true)
            const token = getToken();
            if (token && currentAccount) {
                try {
                    const { is_admin } = await getMe();
                    setIsAuthenticated(true);
                    setIsAdmin(is_admin);
                } catch (e) {
                    console.error("Failed to validate session:", e);
                    // Optionally force sign out if token is invalid, but for now just don't set auth
                    // setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
                setIsAdmin(false);
            }
            setIsAuthenticating(false)
        };
        checkAuth();
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
            const { token, is_admin } = await apiSignIn({
                address: currentAccount.address,
                nonce,
                message,
                signature: signatureBase64,
            });

            // 5. Store token
            setToken(token);
            setIsAuthenticated(true);
            setIsAdmin(is_admin);
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
        setIsAdmin(false);
        disconnect()
    };

    return {
        isAuthenticated,
        isAuthenticating,
        isAdmin,
        signIn,
        signOut,
        error,
        user: currentAccount,
    };
}
