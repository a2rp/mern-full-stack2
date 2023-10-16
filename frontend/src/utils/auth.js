import { createContext, useContext, useState } from "react";
import { useCookies } from "react-cookie";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [cookies, removeCookie] = useCookies([]);
    const [admin, setAdmin] = useState(null);

    const login = admin => {
        console.log(admin);
        setAdmin(admin);
    };

    const logout = () => {
        // cookies.remove('Token');
        removeCookie("token");
        window.localStorage.removeItem('admin');
        setAdmin(null);
    };

    return <AuthContext.Provider value={{ admin, login, logout }}>
        {children}
    </AuthContext.Provider>
};

export const useAuth = () => {
    return useContext(AuthContext);
};