"use client"
import styles from "./sidebar.module.css";
import { useState, useEffect, useMemo } from "react";
import AddCategory from "@/components/AddCategory";
import { useAppStore } from "@/store/appStore";
import { useQuery } from "@tanstack/react-query";
import {calculateNewArticles} from "@/lib/calculateNewArticles";
export default function Sidebar() {
    const categories = useAppStore((s) => s.categories);
    const setTypeScreen = useAppStore((s) => s.setTypeScreen);
    const typescreen = useAppStore((s) => s.typescreen);
    const guest = useAppStore((s) => s.guest);
    const [openCategory, setOpenCategory] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const feeds = useAppStore((s) => s.feeds);
    const saved = useAppStore((s) => s.saved);

    const items = useAppStore((s) => s.items);
    const lastFetched = useAppStore((s) => s.lastFetchedAt);
    const setLastFetched = useAppStore((s) => s.setLastFetchedAt);
    const readArticles = useAppStore((s) => s.readArticles);


    const { data: lastData } = useQuery({
        queryKey: ["lastfetched"],
        queryFn: async () => {
            const res = await fetch("/api/lastfetch")
            if (!res.ok) throw new Error("Failed to fetch last fetched date")
            return res.json()
        },
    });

    useEffect(() => {
        if(lastData) {
            setLastFetched(lastData)
        }
    }, [lastFetched, setLastFetched]);

    const { newByFeed, newByCategory, totalNew } = useMemo(() => {
        if (guest) {
            // No guest, contar todos os artigos que não foram lidos
            const newByFeed = {}
            const newByCategory = {}
            let totalNew = 0

            for (const article of items) {
                if (!readArticles[article.id]) {
                    totalNew++
                    newByFeed[article.feed_id] = (newByFeed[article.feed_id] || 0) + 1
                    newByCategory[article.category_id] = (newByCategory[article.category_id] || 0) + 1
                }
            }

            return { newByFeed, newByCategory, totalNew }
        }
        return calculateNewArticles(items, lastFetched)
    }, [items, lastFetched, guest, readArticles]);

    

    return(
        <div className={styles.sidebar}>
            <div className={styles.main}>
                <button className={typescreen === "All items" ? styles.active : ""} onClick={() => setTypeScreen("All items")}>
                    <span>
                    <img src="/newspaper.svg"/>All Items
                    </span>
                    {totalNew > 0 ? totalNew : ""}
                </button>

                <button className={typescreen === "Saved" ? styles.active : ""} onClick={() => setTypeScreen("Saved")}>
                    <span>
                        <img src="/bookmark.svg" />Saved
                    </span>
                    {saved > 0 ? saved.length : ""}
                </button>
            </div>

            <hr className={styles.line}/>
            <div className={styles.categories}>
                <div className={styles.title}>
                    <p>CATEGORIES</p>
                    <button onClick={() => setShowModal(true)}>+</button>
                </div>
                {showModal && <AddCategory onClose={() => setShowModal(false)} />}
                
                {categories.map((cat) => {
                    const categoryFeeds = feeds.filter(
                        (f) => f.category_id === cat.id
                    )
                    const isOpen = openCategory === cat.id
                    const isActive = typescreen === cat.name

                    return (
                        <div key={cat.id} className={styles.categoriescontainer}>
                            <div className={isActive ? `${styles.active} ${styles.cinfo}` : styles.cinfo} onClick={() => {
                                setOpenCategory(isOpen ? null : cat.id);
                                setTypeScreen(cat.name);
                            }}>
                                <div className={styles.cname}>
                                    <span style={{backgroundColor: cat.color}} />
                                    <p>{cat.name}</p>
                                </div>
                                <p className={styles.number}>{newByCategory[cat.id] || 0}</p>
                            </div>
                            {isOpen && categoryFeeds.length > 0 && (
                                <div>
                                    {categoryFeeds.map((feed) => {
                                        const isActiveFeed = typescreen === `feed:${feed.id}`;
                                        return (
                                            <div key={feed.id} className={isActiveFeed ? `${styles.active} ${styles.feed}` : styles.feed} onClick={() => setTypeScreen(`feed:${feed.id}`)}>
                                                <div className={styles.fname}>
                                                    {feed.image_url ? <img src={feed.image_url} /> : ""}
                                                    
                                                    <p>{feed.title}</p>
                                                </div>
                                                <p className={styles.number}>{newByFeed[feed.id] || 0}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}