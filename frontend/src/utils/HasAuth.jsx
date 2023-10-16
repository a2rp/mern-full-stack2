import React from 'react'
import { useAuth } from '../utils/auth'
import { Navigate } from 'react-router-dom';

const HasAuth = ({ children }) => {
    const auth = useAuth();
    auth.admin = window.localStorage.getItem('admin');
    if (auth?.admin) {
        return <Navigate to="/dashboard" />
    } else {
        // console.log(auth, "has auth");
    }

    return children
}

export default HasAuth