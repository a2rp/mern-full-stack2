import React from 'react'
import styles from "./styles.module.scss";
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/auth';

const NavBar = () => {
    const { admin, status, logout } = useAuth();
    const navigate = useNavigate();
    const navlinkStyles = ({ isActive }) => {
        return {
            color: isActive ? "green" : "#fff",
        }
    };

    return (
        <nav className={styles.container}>
            <NavLink
                to="/home"
                className={styles.navlink}
                style={navlinkStyles}
            >Home</NavLink>
            {admin && <NavLink to="/dashboard" className={styles.navlink} style={navlinkStyles}>Dashboard</NavLink>}
            {!admin && status !== "checking" && <NavLink to="/register" className={styles.navlink} style={navlinkStyles}>Register</NavLink>}
            {!admin && status !== "checking" && <NavLink to="/login" className={styles.navlink} style={navlinkStyles}>Login</NavLink>}
            {admin && <button type="button" className={styles.navlink} onClick={async () => { await logout(); navigate("/login", { replace: true }); }}>Logout</button>}
        </nav>
    )
}

export default NavBar
