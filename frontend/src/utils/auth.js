import { createContext, useContext, useEffect, useState } from "react";
import api from "./api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [status, setStatus] = useState("checking");

    useEffect(() => {
        let active = true;
        api.post("/admin", {})
            .then(({ data }) => {
                if (!active) return;
                setAdmin(data.admin);
                setStatus("authenticated");
            })
            .catch(() => {
                if (!active) return;
                setAdmin(null);
                setStatus("anonymous");
            });
        return () => { active = false; };
    }, []);

    const login = (adminDetails) => {
        setAdmin(adminDetails);
        setStatus("authenticated");
    };

    const logout = async () => {
        try {
            await api.post("/admin/logout");
        } finally {
            setAdmin(null);
            setStatus("anonymous");
        }
    };

    return <AuthContext.Provider value={{ admin, status, login, logout }}>
        {children}
    </AuthContext.Provider>
};

export const useAuth = () => {
    return useContext(AuthContext);
};
