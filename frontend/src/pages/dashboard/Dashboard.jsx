import React, { useEffect, useState } from 'react'
import styles from "./styles.module.scss";
import { useAuth } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import AddUser from '../../components/contact/AddUser';
import UpdateUser from '../../components/contact/UpdateUser';

import axios from 'axios';

import useNetwork from '../../hooks/useNetwork';
import UsersTable from '../../components/contact/UsersTable';

const Dashboard = () => {
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

    const navigate = useNavigate(null);
    const auth = useAuth();

    const handleLogout = () => {
        auth.logout();
        navigate("/login");
    };

    const [users, setUsers] = useState([]);
    const localDB = auth.admin + "-users";
    const getUsers = JSON.parse(localStorage.getItem(localDB));
    console.log(getUsers, "getusers");

    useEffect(() => {
        console.log(auth, "auth");
        if (getUsers == null) {
            setUsers([]);
        } else {
            console.log(getUsers, "getUsers");
            // const loggedAdminUsers = getUsers.filter((user) => {
            //     // console.log(user.admin, auth.admin, "user.admin === auth.admin");
            //     return user.admin === auth.admin;
            // });
            setUsers(getUsers);
        }
    }, []);

    // Add User
    const [displayAddUserForm, setDisplayAddUserForm] = useState(true);
    const toggleAddUserForm = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
        setDisplayAddUserForm(displayAddUserForm => !displayAddUserForm);
    };
    const hideAddUserForm = () => {
        setDisplayAddUserForm(true);
    };

    useEffect(() => {
        if (!displayAddUserForm) {
            document.querySelector(".addUserFormContainer").style.cssText = `
                height: 165px;
            `;
        } else {
            document.querySelector(".addUserFormContainer").style.cssText = `
                height: 0;
            `;
        }
    }, [displayAddUserForm]);

    const addUser = (user) => {
        const id = uuidv4();
        const newUser = { ...user, id, admin: auth.admin, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        if (users && users.length > 0) {
            setUsers([...users, newUser]);
        } else {
            setUsers([newUser]);
        }
        Swal.fire({
            icon: 'success',
            title: 'Added successfullly'
        });
        const localDB = auth.admin + "-users";
        if (users && users.length > 0) {
            window.localStorage.setItem(localDB, JSON.stringify([...users, newUser]));
        } else {
            window.localStorage.setItem(localDB, JSON.stringify([newUser]));
        }
    }

    // Delete User
    const deleteUser = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                const remainingUsers = users.filter((user) => user.id !== id);
                setUsers(remainingUsers);
                const localDB = auth.admin + "-users";
                window.localStorage.setItem(localDB, JSON.stringify(remainingUsers));
                let timerInterval;
                Swal.fire({
                    title: 'Success',
                    html: "Deleted Successfully",
                    timer: 2000,
                    timerProgressBar: true,
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                });
            }
        })
    }

    // Edit User
    const [editableUser, setEditableUser] = useState(null);
    const [toggleUpdateContainer, setToggleUpdateContainer] = useState(false);
    const displayUpdateSection = (id) => {
        const user = users.filter((user) => user.id === id);
        setEditableUser(user[0]);
        setToggleUpdateContainer(true);
    };
    const hideUpdateSection = () => {
        setToggleUpdateContainer(false);
    };
    useEffect(() => {
        if (toggleUpdateContainer) {
            document.querySelector(".updateContainer").style.display = "block";
        } else {
            document.querySelector(".updateContainer").style.display = "none";
        }
    }, [toggleUpdateContainer]);

    const editUser = (editUser) => {
        const name = editUser.name;
        const mobile = editUser.mobile;
        const email = editUser.email;

        if (!name || !mobile || !email) {
            return Swal.fire({
                icon: 'error',
                title: 'All fields required'
            })
        }

        if (name.trim().length < 5 || !name.match("^[a-zA-Z ]*$")) {
            return Swal.fire({
                icon: "error",
                title: "Invalid Name [only alphabets allowed, min 5 chars]"
            });
        }

        if (mobile.trim().length < 10 || !mobile.match(/^[0-9]*$/)) {
            return Swal.fire({
                icon: "error",
                title: "Invalid Phone Number [only numbers allowed, length > 10]"
            });
        }

        if (email.trim().length === 0 || !email.match(/^(?=[^@]*[A-Za-z])([a-zA-Z0-9])(([a-zA-Z0-9])*([\._-])?([a-zA-Z0-9]))*@(([a-zA-Z0-9\-])+(\.))+([a-zA-Z]{2,4})+$/i)) {
            return Swal.fire({
                icon: "error",
                title: "Invalid Email [only alphanumeric allowed]"
            });
        }

        const localDB = auth.admin + "-users";
        let data = JSON.parse(localStorage.getItem(localDB));
        const updatedData = data.map(user => {
            if (user.id === editUser.id) {
                return {
                    ...user,
                    name,
                    mobile,
                    email,
                    updatedAt: new Date().toISOString(),
                    id: uuidv4()
                }
            }
            return user;
        });

        Swal.fire({
            icon: 'success',
            title: 'Updated successfullly'
        });
        window.localStorage.setItem(localDB, JSON.stringify(updatedData));
        setUsers(JSON.parse(window.localStorage.getItem(localDB)));
    }

    // fetchdata
    const fetchData = async () => {
        if (!online) {
            return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "NOT CONNECTED TO INTERNET. Enable WI-FI / Mobile Data.",
            });
        }
        try {
            const response = await axios.get(`${url}/user`, { admin: auth.admin });
            console.log(response.data.message);
            if (response.data.success) {
                if (response.data.message.length === 0) {
                    return Swal.fire({
                        icon: 'error',
                        title: 'No data found',
                        text: response.data.message,
                    });
                }
                setUsers(response.data.message);
                const localDB = auth.admin + "-users";
                window.localStorage.setItem(localDB, JSON.stringify(response.data.message));
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error fetching users',
                    text: response.data.message,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error fetching users',
                text: error.data.message,
            });
        }
    };

    // sorting
    const [sortName, setSortName] = useState(true);
    const sortByName = () => {
        setSortName(sortName => !sortName);
        if (sortName) {
            setUsers(Array.from(users).sort((a, b) => (a.name > b.name) ? 1 : -1));
        } else {
            setUsers(Array.from(users).sort((a, b) => (a.name < b.name) ? 1 : -1));
        }
    };

    // last modified
    const [lastModified, setLastModified] = useState(true);
    const sortByLastModified = () => {
        setLastModified(lastModified => !lastModified);
        console.log(lastModified);
        if (lastModified) {
            setUsers(Array.from(users).sort((a, b) => (new Date(a.updatedAt) > new Date(b.updatedAt)) ? 1 : -1));
        } else {
            setUsers(Array.from(users).sort((a, b) => (new Date(a.updatedAt) < new Date(b.updatedAt)) ? 1 : -1));
        }
    };

    // last inserted
    const [lastInserted, setLastInserted] = useState(true);
    const sortByLastInserted = () => {
        setLastInserted(lastInserted => !lastInserted);
        if (lastInserted) {
            setUsers(Array.from(users).sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1));
        } else {
            setUsers(Array.from(users).sort((a, b) => (a.createdAt < b.createdAt) ? 1 : -1));
        }
    };

    // view details 
    const displayData = (name, mobile, email) => {
        let timerInterval;
        Swal.fire({
            title: 'Success',
            html: `Name: ${name}<br />Mobile: ${mobile}<br />Email: ${email}`,
            timer: 2000,
            timerProgressBar: true,
            willClose: () => {
                clearInterval(timerInterval)
            }
        });
    };

    // searching
    const [searchText, setSearchText] = useState("");
    useEffect(() => {
        console.log(searchText);
        const searchedData = getUsers && getUsers.filter(person => person.name.toLowerCase().includes(searchText.toLowerCase())
            || person.mobile.toLowerCase().includes(searchText.toLowerCase())
            || person.email.toLowerCase().includes(searchText.toLowerCase()));
        setUsers(searchedData);
    }, [searchText]);

    return (
        <div className={styles.container}>

            <div className={styles.welcome}>
                Welcome {auth?.admin}
                <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
            </div>

            <div className={styles.contentContainer}>
                <div className={styles.heading}>Dashboard</div>
                <button className={styles.addUserToggleButton} onClick={toggleAddUserForm}>+</button>
                <div className={`${styles.addUserFormContainer} addUserFormContainer`}>
                    <AddUser onSave={addUser} hideAddUserForm={hideAddUserForm} />
                </div>

                <div className={styles.filterData}>
                    <h1 className={styles.filterDataHeading}>Filter Data</h1>
                    <button onClick={sortByName}>A-Z / Z-A</button>
                    <button onClick={sortByLastModified}>Last modified</button>
                    <button onClick={sortByLastInserted}>Last Inserted</button>
                    <input type="text" className={styles.search} name="search" id="search" placeholder="search" onChange={(event) => setSearchText(event.target.value)} />
                </div>

                <UsersTable users={users} displayData={displayData} displayUpdateSection={displayUpdateSection} deleteUser={deleteUser} />

                {!users || users.length === 0
                    ? <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "15px" }}>
                        {searchText.trim().length === 0
                            ? <button onClick={fetchData} style={{ padding: "15px", marginBottom: "15px" }}>Fetch Data from server</button>
                            : ""}
                        <img src='https://placehold.co/600x400?text=No+Data+Found' alt='No Data Found' />
                    </div>
                    : ""}
            </div>

            <div className={`${styles.updateContainer} updateContainer`}>
                <div className={styles.closeUpdateContainer} onClick={hideUpdateSection}>Close</div>

                <div className={styles.updateFormContainer}>
                    {toggleUpdateContainer && <UpdateUser editableUser={editableUser} editUser={editUser} hideUpdateSection={hideUpdateSection} />}
                </div>
            </div>
        </div>
    )
}

export default Dashboard

