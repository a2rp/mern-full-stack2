import { Routes, Route, Navigate } from "react-router-dom";
import styles from "./styles.module.scss";

import Home from "./pages/home/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import NoMatchRoute from "./pages/noMatchRoute/NoMatchRoute";

import NavBar from "./components/navBar/NavBar";

import { AuthProvider } from "./utils/auth";

import RequireAuth from "./utils/RequireAuth";
import HasAuth from "./utils/HasAuth";

function App() {
    let url = "";
    if (window.location.hostname === "localhost"
        || window.location.hostname === "127.0.0.1") {
        url = "http://localhost:5000/ashishranjan-net/asia-south1/api/v1";
    } else {
        url = "https://asia-south1-ashishranjan-net.cloudfunctions.net/api/v1";
    }
    console.log(url);

    return (
        <div className={styles.container}>
            <AuthProvider>
                <NavBar />
                <div className={styles.routesContainer}>
                    <Routes>
                        <Route
                            path="/"
                            element={<Navigate to="/home" />} />
                        <Route
                            path="/home"
                            element={<Home />} />
                        <Route
                            path="/dashboard"
                            element={<RequireAuth> <Dashboard /> </RequireAuth>} />
                        <Route
                            path="/login"
                            element={<HasAuth> <Login /> </HasAuth>} />
                        <Route
                            path="/register"
                            element={<Register />} />
                        <Route
                            path="*"
                            element={<NoMatchRoute />} />
                    </Routes>
                </div>
            </AuthProvider>
        </div>
    );
}

export default App;