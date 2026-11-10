import { useEffect, useState } from "react";

const UpdateUser = ({ editableUser, editUser, hideUpdateSection }) => {
    const [user, setUser] = useState({ name: "", email: "", mobile: "" });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setUser({ _id: editableUser._id, name: editableUser.name, email: editableUser.email, mobile: editableUser.mobile });
    }, [editableUser]);

    const updateUser = async (event) => {
        event.preventDefault();
        setSaving(true);
        await editUser(user);
        setSaving(false);
    };

    return (
        <form onSubmit={updateUser}>
            <h2 style={{ fontSize: "20px", color: "#000", textAlign: "center" }}>Update user</h2>
            <input required minLength="2" maxLength="100" type="text" placeholder="Name" value={user.name} onChange={(event) => setUser({ ...user, name: event.target.value })} style={{ marginTop: "15px", width: "100%", height: "30px", paddingLeft: "15px" }} />
            <input required type="email" placeholder="Email" value={user.email} onChange={(event) => setUser({ ...user, email: event.target.value })} style={{ marginTop: "15px", width: "100%", height: "30px", paddingLeft: "15px" }} />
            <input required type="tel" placeholder="Phone" value={user.mobile} onChange={(event) => setUser({ ...user, mobile: event.target.value })} style={{ marginTop: "15px", width: "100%", height: "30px", paddingLeft: "15px" }} />
            <button type="submit" disabled={saving} style={{ marginTop: "15px", width: "100%", height: "30px" }}>{saving ? "Saving…" : "Update"}</button>
            <button type="button" onClick={hideUpdateSection} style={{ marginTop: "15px", width: "100%", height: "30px" }}>Cancel</button>
        </form>
    );
};

export default UpdateUser;
