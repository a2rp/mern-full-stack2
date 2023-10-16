import React from 'react'
import styles from "./styles.module.scss";

const Home = () => {
    return (
        <div className={styles.container}>
            <div className={styles.heading}>Welcome to Full-Stack Development</div>
            <div className={styles.info}>This site uses express slow down so api requests response might be slow</div>
            <div className={styles.ps}>a2rp: an Ashish Ranjan presentation</div>
        </div>
    )
}

export default Home