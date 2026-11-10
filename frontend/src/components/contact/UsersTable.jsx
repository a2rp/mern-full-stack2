import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";

const UsersTable = ({ users, displayData, displayUpdateSection, deleteUser }) => {
    const styles = {
        section: { overflowX: "auto" },
        table: { width: "100%", tableLayout: "fixed", backgroundColor: "aliceblue" },
        th: { backgroundColor: "#333", color: "#fff", padding: "15px" },
        td: { textAlign: "center", padding: "8px", overflowWrap: "anywhere" },
        edit: { color: "blueviolet", fontSize: "25px", cursor: "pointer" },
        remove: { color: "orangered", fontSize: "25px", cursor: "pointer", marginLeft: "20px" },
    };
    const formatDate = (value) => value ? new Date(value).toLocaleString() : "";

    return (
        <div style={styles.section}>
            <table style={styles.table}>
                <thead><tr>
                    <th style={styles.th}>Name</th><th style={styles.th}>Phone</th><th style={styles.th}>Email</th>
                    <th style={styles.th}>Created</th><th style={styles.th}>Updated</th><th style={styles.th}>Actions</th>
                </tr></thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td style={styles.td} onClick={() => displayData(user)}>{user.name}</td>
                            <td style={styles.td} onClick={() => displayData(user)}>{user.mobile}</td>
                            <td style={styles.td} onClick={() => displayData(user)}>{user.email}</td>
                            <td style={styles.td}>{formatDate(user.createdAt)}</td>
                            <td style={styles.td}>{formatDate(user.updatedAt)}</td>
                            <td style={styles.td}>
                                <FaRegEdit style={styles.edit} onClick={() => displayUpdateSection(user)} title="Edit user" />
                                <RiDeleteBin5Fill style={styles.remove} onClick={() => deleteUser(user._id)} title="Delete user" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersTable;
