import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from 'react';

import type { LoginResponse } from '../types/auth';

interface AuthUser {
    username: string;
    role: 'ADMIN' | 'STUDENT';
}

interface AuthContextValue {
    user: AuthUser | null;
    login: (data: LoginResponse) => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext =
    createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'crs_token';
const USER_KEY = 'crs_user';

export function AuthProvider({
                                 children,
                             }: {
    children: ReactNode;
}) {
    const [user, setUser] =
        useState<AuthUser | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        const savedUser =
            localStorage.getItem(USER_KEY);

        const savedToken =
            localStorage.getItem(TOKEN_KEY);

        if (savedUser && savedToken) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
                setUser(null);
            }
        }

        setLoading(false);
    }, []);

    const login = (data: LoginResponse) => {
        localStorage.setItem(
            TOKEN_KEY,
            data.token
        );

        const authUser: AuthUser = {
            username: data.username,
            role: data.role,
        };

        localStorage.setItem(
            USER_KEY,
            JSON.stringify(authUser)
        );

        setUser(authUser);
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const ctx = useContext(AuthContext);

    if (!ctx) {
        throw new Error(
            'useAuth phai duoc dung ben trong AuthProvider'
        );
    }

    return ctx;
}