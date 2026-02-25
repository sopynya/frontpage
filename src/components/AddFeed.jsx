"use client";

import styles from "./addfeed.module.css"
import { useState } from "react";
import { useAppStore } from "@/store/appStore"
import Link from "next/link";

export default function AddFeed({onClose}) {
    const [site, setSite] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const guest = useAppStore((s) => s.guest)
    const addFeed = useAppStore((s) => s.addFeed)
    const categories = useAppStore((s) => s.categories);

    async function add(e) {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const endpoint = guest ? "/api/add/guestfeed" : "/api/add/feed";
            
            const res = await fetch(endpoint, {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify({url: site, categoryId: selectedCategory})
            });
            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.error)
            }

            addFeed(data);


            onClose()
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className={styles.bg}>
            <div className={styles.modal}>
                <p className={styles.close} onClick={onClose}>X</p>
                <h2>Add your feed</h2>
                <form className={styles.form} onSubmit={add}>
                    <label>RSS/Atom</label>
                    <input type="url" placeholder="Feed URL " value={site} onChange={(e) => setSite(e.target.value)} required/>
                    <label>Categories</label>
                    <div className={styles.category}>
                        <button className={selectedCategory === null ? styles.active : ""} type="button" onClick={() => setSelectedCategory(null)}>None</button>

                        {categories.map((category) => (
                            <button 
                            className={category.name === selectedCategory ? styles.active : ""}
                                key={category.id}
                                type="button"
                                onClick={() => setSelectedCategory(category.name)}
                                >
                            {category.name}
                            </button>
                        ))}
                    </div>
                    <button type='submit' disabled={loading} className={styles.done}>{loading ? 'Loading...' : 'Done'}</button>
                    {error && <p className={styles.error}>{error}</p>}
                    {guest && <Link href="/" className={styles.warning}>Log in to save your feed</Link>}
                </form>
            </div>
        </div>
    );
}