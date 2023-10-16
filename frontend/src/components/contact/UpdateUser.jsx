import React, { useEffect, useRef, useState } from 'react';

const UpdateUser = ({ editableUser, editUser, hideUpdateSection }) => {
    // console.log(user, theUser, "immediate update user");
    const [user, setUser] = useState({ name: "", email: "", mobile: "" });

    const updateUser = () => {
        // console.log(user, "currentUser");
        editUser({
            id: user.id,
            name: user.name,
            mobile: user.mobile,
            email: user.email
        });
    };

    useEffect(() => {
        setUser(editableUser);
    }, [editableUser]);

    return (
        <div>
            <div style={{ fontSize: "20px", color: "#000", textAlign: "center" }}>
                UPDATE USER
            </div>
            <input
                type="text"
                placeholder='name'
                value={user.name}
                onChange={(event) => setUser({ ...user, name: event.target.value })}
                style={{
                    marginTop: "15px",
                    width: "100%",
                    height: "30px",
                    paddingLeft: "15px",
                }} />

            <input
                type="email"
                placeholder='email'
                value={user.email}
                onChange={(event) => setUser({ ...user, email: event.target.value })}
                style={{
                    marginTop: "15px",
                    width: "100%",
                    height: "30px",
                    paddingLeft: "15px",
                }} />

            <input
                type="text"
                placeholder='mobile'
                value={user.mobile}
                onChange={(event) => setUser({ ...user, mobile: event.target.value })}
                style={{
                    marginTop: "15px",
                    width: "100%",
                    height: "30px",
                    paddingLeft: "15px",
                }} />

            <input
                type="button"
                value="Update"
                onClick={updateUser}
                style={{
                    marginTop: "15px",
                    width: "100%",
                    height: "30px"
                }} />

            <input
                type="button"
                value="Cancel"
                onClick={hideUpdateSection}
                style={{
                    marginTop: "15px",
                    width: "100%",
                    height: "30px",
                }} />
        </div>
    )
}

export default UpdateUser