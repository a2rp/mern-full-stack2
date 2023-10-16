import React, { useEffect, useState } from 'react'
import styles from "./styles.module.scss";
import { useAuth } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Swal from "sweetalert2";

import useNetwork from '../../hooks/useNetwork';

const Login = () => {
    let url = "";
    if (window.location.hostname === "localhost"
        || window.location.hostname === "127.0.0.1") {
        url = "http://localhost:5000/ashishranjan-net/asia-south1/api/v1";
    } else {
        url = "https://asia-south1-ashishranjan-net.cloudfunctions.net/api/v1";
    }

    const networkState = useNetwork();
    const {
        online
    } = networkState;

    const navigate = useNavigate();
    const auth = useAuth();

    const [user, setUser] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (event) => {
        // console.log(user, "user");
        if (!online) {
            return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "NOT CONNECTED TO INTERNET. Enable WI-FI / Mobile Data.",
            });
        }

        const options = {
            url: `${url}/admin/login`,
            method: 'POST',
            withCredentials: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            data: {
                email: user.email,
                password: user.password
            }
        };

        try {
            setIsLoading(true);
            const response = await axios.request(options);
            // console.log(response);
            if (!response.data.success) {
                return Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.message,
                });
            }

            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: response.data.message,
            });

            auth.login(response.data.email);
            window.localStorage.setItem("admin", response.data.email);
            navigate("/dashboard", { replace: true });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const [admins, setAdmins] = useState(null);
    useEffect(() => {
        const getAll = async () => {
            const response = await axios.get(`${url}/admin`);
            const admins = response.data.message;

            if (!response.data.success) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error fetching admins',
                    text: response.data.message,
                });
            } else {
                console.log(response.data.message);
                setAdmins(response.data.message);
            }
        };
        getAll();
    }, [])


    return (
        <div className={styles.container}>
            <div className={styles.heading}>Login</div>

            <input
                type="email"
                placeholder="Email Address"
                name="email"
                id="email"
                value={user.email}
                onChange={(event) => setUser({ ...user, email: event.target.value })} />

            <input
                type="password"
                placeholder="Password"
                name="password"
                id="password"
                value={user.password}
                onChange={(event) => setUser({ ...user, password: event.target.value })} />

            <input
                type="button"
                className={styles.button}
                value="Login"
                onClick={handleLogin}
                disabled={isLoading} />
        </div>
    )
}

export default Login

