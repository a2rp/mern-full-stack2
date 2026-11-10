import { Navigate } from "react-router-dom";
import { useAuth } from "./auth";

const RequireAuth = ({ children }) => {
    const { admin, status } = useAuth();
    if (status === "checking") return <p role="status">Checking session…</p>;
    return admin ? children : <Navigate to="/login" replace />;
}

export default RequireAuth
