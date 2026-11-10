import React, { useState } from "react";
import styles from "./styles.module.scss";
import { useAuth } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api, { getErrorMessage } from "../../utils/api";

const Login = () => {
    const navigate = useNavigate();
    const auth = useAuth();
    const [user, setUser] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await api.post("/admin/login", user);
            auth.login(data.admin);
            navigate("/dashboard", { replace: true });
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Login failed",
                text: getErrorMessage(error, "Check your email and password, then try again."),
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.heading}>Login</div>
            <form onSubmit={handleLogin}>
                <input type="email" autoComplete="email" placeholder="Email address" name="email" value={user.email} onChange={(event) => setUser({ ...user, email: event.target.value })} required />
                <input type="password" autoComplete="current-password" placeholder="Password" name="password" value={user.password} onChange={(event) => setUser({ ...user, password: event.target.value })} required />
                <button type="submit" className={styles.button} disabled={isLoading}>{isLoading ? "Signing in…" : "Login"}</button>
            </form>
        </div>
    );
};

export default Login;
