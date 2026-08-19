import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { auth, type Profile } from '@/lib/auth-api';

type AuthState = {
    user: Profile | null;
    loading: boolean;
    setUser: (user: Profile | null) => void;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    // One session check on boot; every page needs to know who is signed in.
    useEffect(() => {
        let active = true;

        auth.me()
            .then((profile) => active && setUser(profile))
            .catch(() => active && setUser(null))
            .finally(() => active && setLoading(false));

        return () => {
            active = false;
        };
    }, []);

    const signOut = useCallback(async () => {
        await auth.logout().catch(() => null);
        setUser(null);
    }, []);

    const value = useMemo(() => ({ user, loading, setUser, signOut }), [user, loading, signOut]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }

    return context;
}
