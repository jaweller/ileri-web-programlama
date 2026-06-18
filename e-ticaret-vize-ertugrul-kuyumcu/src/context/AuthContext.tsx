import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth, googleProvider } from '../firebase';
import {
    onAuthStateChanged,
    signOut,
    type User,
    signInWithPopup
} from 'firebase/auth';

interface AuthContextType {
    currentUser: User | null;
    isAdmin: boolean;
    loginWithGoogle: () => Promise<any>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    // Kendi Google e-posta adresini buraya yazarak admin yapabilirsin!
    const ADMIN_EMAIL = "ertugrulkuyumcu@stu.topkapi.edu.tr";

    function loginWithGoogle() {
        return signInWithPopup(auth, googleProvider);
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setIsAdmin(user !== null && user.email === ADMIN_EMAIL);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value: AuthContextType = {
        currentUser,
        isAdmin,
        loginWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}