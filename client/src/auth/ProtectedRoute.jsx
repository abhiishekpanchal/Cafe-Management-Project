import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <p>Loading...</p>; // Show loading spinner or message
    }

    return user ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
