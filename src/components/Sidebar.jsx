"use client"
import styles from "./sidebar.module.css";
import { useState } from "react";
import { useAppStore } from "@/store/appStore";
export default function Sidebar() {
    const categories = useAppStore((s) => s.categories);
    const [openCategory, setOpenCategory] = useState(null)
    const feeds = useAppStore((s) => s.feeds);
    return(
        <div className={styles.sidebar}>
            <div className={styles.main}>
                <button>
                    <span>
                    <img src="/newspaper.svg"/>All Items
                    </span>
                    {feeds.length}
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
                <div className={styles.title}>
                    <p>CATEGORIES</p>
                    <button>+</button>
                </div>
                
                {categories.map((cat) => {
                    const categoryFeeds = feeds.filter(
                        (f) => f.category_id === cat.id
                    )
                    const isOpen = openCategory === cat.id

                    return (
                        <div key={cat.id} className={styles.categoriescontainer}>
                            <div className={openCategory === cat.id ? `${styles.active} ${styles.cinfo}` : styles.cinfo} onClick={() => setOpenCategory(isOpen ? null : cat.id)}>
                                <div className={styles.cname}>
                                    <span style={{backgroundColor: cat.color}} />
                                    <p>{cat.name}</p>
                                </div>
                                <p className={styles.number}>0</p>
                            </div>
                            {isOpen  && (
                                <div>
                                    {categoryFeeds.map((feed) => (
                                        <div key={feed.id} className={styles.feed}>
                                            <div className={styles.fname}>
                                                {feed.image_url ? <img src={feed.image_url} /> : ""}
                                                
                                                <p>{feed.title}</p>
                                            </div>
                                            <p className={styles.number}>0</p>
                                        </div>
                                        
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}