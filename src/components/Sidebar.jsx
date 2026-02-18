"use client"
import styles from "./sidebar.module.css";
export default function Sidebar() {
    return(
        <div className={styles.sidebar}>
            <div className={styles.main}>
                <button>
                    <span>
                    <img src="/newspaper.svg"/>All Items
                    </span>
                    0
                </button>

                <button>
                    <span>
                        <img src="/bookmark.svg" />Saved
                    </span>
                    0
                </button>
            </div>

            <hr className={styles.line}/>
            <div className={styles.categories}>
                <p className={styles.title}>CATEGORIES</p>
                
            </div>
        </div>
    );
}