import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
    const { currentUser, isAdmin } = useAuth();

    // Giriş yapılmadıysa veya giriş yapan kişi admin değilse ana sayfaya fırlat
    if (!currentUser || !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}