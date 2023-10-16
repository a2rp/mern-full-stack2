import React from 'react'
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";

const UsersTable = ({ users, displayData, displayUpdateSection, deleteUser }) => {
    const styles = {
        usersSections: {
            border: "1px solid #f00",
        },
        usersTable: {
            width: "100%",
            tableLayout: "fixed",
            backgroundColor: "aliceblue"
        },
        thead: {
            padding: "15px"
        },
        th: {
            backgroundColor: "#333",
            color: "#fff",
            padding: "15px"
        },
        td: {
            textAlign: "center",
        },
        editIcon: {
            color: "#0f0",
            fontSize: "30px"
        },
        deleteIcon: {
            color: "orangered",
            fontSize: "30px",
            marginLeft: "30px",
        },
        buttonColumn: {
            display: "flex",
            justifyContent: "center",
        }
    };

    return (
        <div>
            <div style={styles.usersSections}>
                <table style={styles.usersTable}>
                    <thead style={styles.thead}>
                        <tr style={styles.tr}>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Mobile</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Created At</th>
                            <th style={styles.th}>Updated At</th>
                            <th style={styles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.map((user, index) => (
                            <tr key={index}>
                                <td style={styles.td} onClick={() => displayData(user.name, user.mobile, user.email)}>
                                    {user.name}
                                </td>
                                <td style={styles.td} onClick={() => displayData(user.name, user.mobile, user.email)}>
                                    {user.mobile}
                                </td>
                                <td style={styles.td} onClick={() => displayData(user.name, user.mobile, user.email)}>
                                    {user.email}
                                </td>
                                <td style={styles.td} onClick={() => displayData(user.name, user.mobile, user.email)}>
                                    {new Date(user.createdAt).toString()}
                                </td>
                                <td style={styles.td} onClick={() => displayData(user.name, user.mobile, user.email)}>
                                    {new Date(user.updatedAt).toString()}
                                </td>
                                <td style={styles.buttonColumn}>
                                    <div style={styles.editDeleteContainer}>
                                        <FaRegEdit
                                            style={styles.editIcon}
                                            onClick={() => displayUpdateSection(user.id)}
                                            title="EDIT" />
                                        <RiDeleteBin5Fill
                                            style={styles.deleteIcon}
                                            onClick={() => deleteUser(user.id)}
                                            title="DELETE" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UsersTable
