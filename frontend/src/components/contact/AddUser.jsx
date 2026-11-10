import { useState } from "react";
import Swal from "sweetalert2";

const AddUser = ({ onSave, hideAddUserForm }) => {
    const [user, setUser] = useState({ name: "", mobile: "", email: "" });
    const [saving, setSaving] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();
        const details = {
            name: user.name.trim(),
            mobile: user.mobile.trim(),
            email: user.email.trim().toLowerCase(),
        };
        if (details.name.length < 2 || details.mobile.length < 7 || !/^\+?\d{7,15}$/.test(details.mobile) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
            await Swal.fire({ icon: "error", title: "Enter a valid name, email, and phone number." });
            return;
        }
        setSaving(true);
        const saved = await onSave(details);
        if (saved) setUser({ name: "", mobile: "", email: "" });
        setSaving(false);
    };

    return (
        <form onSubmit={onSubmit} style={{ padding: "15px" }}>
            <input style={{ display: "block", width: "100%", paddingLeft: "15px", height: "30px" }} type="text" placeholder="Name" value={user.name} onChange={(event) => setUser({ ...user, name: event.target.value })} />
            <input style={{ display: "block", width: "100%", paddingLeft: "15px", height: "30px", marginTop: "5px" }} type="tel" placeholder="Phone" value={user.mobile} onChange={(event) => setUser({ ...user, mobile: event.target.value })} />
            <input style={{ display: "block", width: "100%", paddingLeft: "15px", height: "30px", marginTop: "5px" }} type="email" placeholder="Email" value={user.email} onChange={(event) => setUser({ ...user, email: event.target.value })} />
            <button style={{ width: "48%", height: "30px", marginTop: "5px", backgroundColor: "green", color: "#fff" }} type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
            <button style={{ width: "48%", height: "30px", marginTop: "5px", float: "right", backgroundColor: "orangered", color: "#fff" }} type="button" onClick={hideAddUserForm}>Cancel</button>
        </form>
    );
};

export default AddUser;
