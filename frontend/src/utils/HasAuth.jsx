import { Navigate } from "react-router-dom";
import { useAuth } from "./auth";

const HasAuth = ({ children }) => {
    const { admin, status } = useAuth();
    if (status === "checking") return <p role="status">Checking session…</p>;
    return admin ? <Navigate to="/dashboard" replace /> : children;
}

export default HasAuth
