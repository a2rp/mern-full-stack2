import React, { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AddUser from "../../components/contact/AddUser";
import UpdateUser from "../../components/contact/UpdateUser";
import UsersTable from "../../components/contact/UsersTable";
import { useAuth } from "../../utils/auth";
import api, { getErrorMessage } from "../../utils/api";

const Dashboard = () => {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [addOpen, setAddOpen] = useState(false);
    const [editableUser, setEditableUser] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");

    useEffect(() => {
        let active = true;
        api.get("/user")
            .then(({ data }) => { if (active) setUsers(data.users); })
            .catch((requestError) => {
                if (active) setError(getErrorMessage(requestError, "Unable to load users."));
            })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    const visibleUsers = useMemo(() => {
        const query = searchText.trim().toLowerCase();
        const filtered = users.filter((user) =>
            [user.name, user.mobile, user.email].some((value) => value.toLowerCase().includes(query))
        );
        return filtered.sort((first, second) => {
            if (sortBy === "name") return first.name.localeCompare(second.name);
            if (sortBy === "updatedAt") return new Date(second.updatedAt) - new Date(first.updatedAt);
            return new Date(second.createdAt) - new Date(first.createdAt);
        });
    }, [users, searchText, sortBy]);

    const addUser = async (details) => {
        try {
            const { data } = await api.post("/user/add", details);
            setUsers((current) => [data.user, ...current]);
            setAddOpen(false);
            await Swal.fire({ icon: "success", title: data.message });
            return true;
        } catch (requestError) {
            await Swal.fire({ icon: "error", title: "Could not add user", text: getErrorMessage(requestError, "Please try again.") });
            return false;
        }
    };

    const deleteUser = async (id) => {
        const confirmation = await Swal.fire({
            title: "Delete this user?",
            text: "This permanently removes the user from the database.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
        });
        if (!confirmation.isConfirmed) return;
        try {
            const { data } = await api.delete("/user/" + id);
            setUsers((current) => current.filter((user) => user._id !== id));
            await Swal.fire({ icon: "success", title: data.message });
        } catch (requestError) {
            await Swal.fire({ icon: "error", title: "Could not delete user", text: getErrorMessage(requestError, "Please try again.") });
        }
    };

    const editUser = async (details) => {
        try {
            const { data } = await api.patch("/user/" + details._id, details);
            setUsers((current) => current.map((user) => user._id === data.user._id ? data.user : user));
            setEditableUser(null);
            await Swal.fire({ icon: "success", title: data.message });
        } catch (requestError) {
            await Swal.fire({ icon: "error", title: "Could not update user", text: getErrorMessage(requestError, "Please try again.") });
        }
    };

    const handleLogout = async () => {
        try { await logout(); } catch (_) {}
        navigate("/login", { replace: true });
    };

    const displayData = (user) => Swal.fire({
        title: user.name,
        text: "Phone: " + user.mobile + "\nEmail: " + user.email,
    });

    return (
        <div className={styles.container}>
            <div className={styles.welcome}>
                Welcome {admin?.name}
                <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
            </div>

            <div className={styles.contentContainer}>
                <div className={styles.heading}>Dashboard</div>
                <button className={styles.addUserToggleButton} onClick={() => setAddOpen((open) => !open)} aria-expanded={addOpen}>+</button>
                <div className={styles.addUserFormContainer} style={{ height: addOpen ? "180px" : "0px" }}>
                    <AddUser onSave={addUser} hideAddUserForm={() => setAddOpen(false)} />
                </div>

                <div className={styles.filterData}>
                    <h1 className={styles.filterDataHeading}>Filter Data</h1>
                    <button onClick={() => setSortBy("name")}>A-Z</button>
                    <button onClick={() => setSortBy("updatedAt")}>Last modified</button>
                    <button onClick={() => setSortBy("createdAt")}>Last added</button>
                    <input type="search" className={styles.search} name="search" placeholder="Search users" value={searchText} onChange={(event) => setSearchText(event.target.value)} />
                </div>

                {error && <p role="alert">{error}</p>}
                {loading ? <p role="status">Loading users…</p> : (
                    <>
                        <UsersTable users={visibleUsers} displayData={displayData} displayUpdateSection={setEditableUser} deleteUser={deleteUser} />
                        {visibleUsers.length === 0 && <p style={{ padding: "15px" }}>{searchText ? "No users match this search." : "No users have been added yet."}</p>}
                    </>
                )}
            </div>

            {editableUser && (
                <div className={styles.updateContainer} style={{ display: "block" }} role="dialog" aria-modal="true" aria-label="Update user">
                    <button className={styles.closeUpdateContainer} onClick={() => setEditableUser(null)}>Close</button>
                    <div className={styles.updateFormContainer}>
                        <UpdateUser editableUser={editableUser} editUser={editUser} hideUpdateSection={() => setEditableUser(null)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
