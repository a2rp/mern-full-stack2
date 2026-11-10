import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import Swal from "sweetalert2";
import { useAuth } from "../../utils/auth";
import api, { getErrorMessage } from "../../utils/api";

const Register = () => {
    const navigate = useNavigate();
    const auth = useAuth();
    const [form, setForm] = useState({
        name: "", email: "", phone: "", gender: "others", city: "mumbai",
        password: "", confirmPassword: "", registrationKey: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (form.name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
            || !/^\+?\d{7,15}$/.test(form.phone.trim())) {
            await Swal.fire({ icon: "error", title: "Enter a valid name, email, and phone number." });
            return;
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,72}$/.test(form.password)) {
            await Swal.fire({ icon: "error", title: "Use 12-72 characters with uppercase, lowercase, a number, and a symbol." });
            return;
        }
        if (form.password !== form.confirmPassword) {
            await Swal.fire({ icon: "error", title: "Passwords do not match." });
            return;
        }
        if (form.registrationKey.length < 32) {
            await Swal.fire({ icon: "error", title: "Enter the admin enrollment key provided by the repository owner." });
            return;
        }

        setIsLoading(true);
        try {
            const stateByCity = { mumbai: "maharashtra", pune: "maharashtra", ahmedabad: "gujarat" };
            const { data } = await api.post("/admin/register", {
                name: form.name.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
                gender: form.gender,
                city: form.city,
                state: stateByCity[form.city],
                hear_about_this: {},
                password: form.password,
                confirm_password: form.confirmPassword,
            }, { headers: { "X-Admin-Registration-Key": form.registrationKey } });
            auth.login(data.admin);
            navigate("/dashboard", { replace: true });
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Registration failed",
                text: getErrorMessage(error, "Check the details and try again."),
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.contentContainer}>
                <h2 className={styles.heading}>Create admin account</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.section1}>
                        <input type="text" name="name" value={form.name} placeholder="Your name" onChange={update} autoComplete="name" required />
                        <input type="email" name="email" value={form.email} placeholder="Your email" onChange={update} autoComplete="email" required />
                        <input type="tel" name="phone" value={form.phone} placeholder="Your phone number" onChange={update} autoComplete="tel" required />
                    </div>

                    <div className={styles.section2}>
                        <div>
                            <label htmlFor="gender">Gender</label>
                            <select id="gender" name="gender" value={form.gender} onChange={update}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="others">Prefer not to say</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="city">City</label>
                            <select id="city" name="city" value={form.city} onChange={update}>
                                <option value="mumbai">Mumbai</option>
                                <option value="pune">Pune</option>
                                <option value="ahmedabad">Ahmedabad</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.section3}>
                        <input type="password" name="password" value={form.password} placeholder="Create password (12+ characters)" onChange={update} autoComplete="new-password" required />
                        <input type="password" name="confirmPassword" value={form.confirmPassword} placeholder="Confirm password" onChange={update} autoComplete="new-password" required />
                    </div>

                    <label htmlFor="registrationKey">Admin enrollment key</label>
                    <input id="registrationKey" type="password" name="registrationKey" value={form.registrationKey} placeholder="Provided by the repository owner" onChange={update} autoComplete="off" required />
                    <button type="submit" disabled={isLoading}>{isLoading ? "Creating account…" : "Create account"}</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
