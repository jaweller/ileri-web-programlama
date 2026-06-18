import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();

  // Eğer kullanıcı giriş YAPMADIYSA, doğrudan login sayfasına yönlendir
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}