"use client"
import styles from "./sidebar.module.css";
export default function Sidebar() {
    return(
        <div className={styles.sidebar}>
            <div className={styles.main}>
                <button><img src="/newspaper.svg"/>All Items</button>
            </div>
        </div>
    );
}