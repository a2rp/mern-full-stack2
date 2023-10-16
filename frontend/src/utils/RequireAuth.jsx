import React from 'react'
import { useAuth } from '../utils/auth'
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children }) => {
    const auth = useAuth();
    auth.admin = window.localStorage.getItem('admin');
    if (!auth?.admin) {
        return <Navigate to="/login" />
    } else {
        // console.log(auth, "require auth");
    }

    return children
}

export default RequireAuth