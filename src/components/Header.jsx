"use client";

import Link from "next/link";
import styles from './header.module.css';
import { usePathname } from "next/navigation";
import AddFeed from "./AddFeed";
import { useState } from "react";
import { useAppStore } from "@/store/appStore";

import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import guestJson from "@/data/sample.json"
import { transformGuestJson } from "@/lib/guestJson"

export default function Header({user}) {
    const [newFeed, setNewFeed] = useState(false);
    const pathname = usePathname();

    const setGuest = useAppStore((s) => s.setGuest);
    const setData = useAppStore((s) => s.setData);
    const setItems = useAppStore((s) => s.setItems);
    const setGridLayout = useAppStore((s) => s.setGridLayout);
    const searchQuery = useAppStore((s) => s.searchQuery);
    const setSearchQuery = useAppStore((s) => s.setSearchQuery);
    const setShowSB = useAppStore((s) => s.setShowSB);
    const showSB = useAppStore((s) => s.showSB);

    const saved = useAppStore((s) => s.saved);
    const setSaved = useAppStore((s) => s.setSaved);

    useEffect(() => {
        setGuest(!user)
    }, [user, setGuest])

    const { data: userData } = useQuery({
        queryKey: ["user-data"],
        queryFn: async () => {
            const res = await fetch("/api/user");
            if(!res.ok) {
                throw new Error("Not authenticated")
            }
            return res.json()
        },
        enabled: !!user,
    })

    useEffect(() => {
        if(!user) {
            const transformed = transformGuestJson(guestJson);
            setData(transformed);
        }
    }, [user, setData])
    
    useEffect(() => {
        if(userData) {
            setData({
                categories: userData.categories,
                feeds: userData.feeds,
            })
        }
    }, [userData, setData]);



    const { data } = useQuery({
        queryKey: ["articles"],
        queryFn: async () => {
            const res = await fetch("/api/articles")
            if (!res.ok) throw new Error("Failed to fetch articles")
            return res.json()
        },
    });

    useEffect(() => {
        if (data) {
            setItems(data);

        }
    }, [data, setItems]);

    const { data: readData } = useQuery({
        queryKey: ["read-articles"],
        queryFn: async () => {
            const res = await fetch("/api/articles/read");
            if (!res.ok) throw new Error("Failed to fetch read articles");
            return res.json();
        },
        enabled: !!user,
    });

    const setReadArticles = useAppStore((s) => s.setReadArticles);

    useEffect(() => {
        if (readData) {
            const arr = Array.isArray(readData) ? readData : readData.articles || [];
            const map = {};
            arr.forEach((a) => {
                map[a] = true;
            });
            setReadArticles(map);
        }
    }, [readData, setReadArticles]);

    const { data: savedData } = useQuery({
        queryKey: ["saved"],
        queryFn: async () => {
            const res = await fetch("/api/saved")
            if (!res.ok) throw new Error("Failed to fetch saved articles")
            return res.json()
        },
        enabled: !!user,
    });

    useEffect(() => {
        if (savedData) {
            // normalize saved API response which may return { articles: [...] }
            const arr = Array.isArray(savedData) ? savedData : savedData.articles || [];
            setSaved(arr);
        }
    }, [savedData, setSaved]);
    return(
        <>
        <header className={styles.header}>
            <nav className={styles.nav}>
                <h1><img src="/icon.png"/>Frontpage</h1>
                <img src="/align.svg"  className={styles.menuBtn} onClick={() => setShowSB(!showSB)} />
                <Link className={pathname === "/feed" ? styles.active : ""} href='/feed'>Feed</Link>
                <Link className={ pathname === "/discover" ? styles.active : ""} href='/discover'>Discover</Link>
            </nav>
            
            <div className={styles.search}>
                <input 
                    type="search" 
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={() => setNewFeed(true)}>+</button>
            </div>

        </header>
        {newFeed && (<AddFeed onClose={() => setNewFeed(false)} />)}
        </>
    )
}