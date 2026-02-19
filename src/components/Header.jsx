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
    setGuest(!user);

    const { data, error } = useQuery({
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
    }, [user])
    
    useEffect(() => {
        if(data) {
            setData({
                categories: data.categories,
                feeds: data.feeds,
            })
        }
    }, [data])
    return(
        <>
        <header className={styles.header}>
            <nav className={styles.nav}>
                <h1><img src="/icon.png"/>Frontpage</h1>
                <Link className={pathname === "/feed" ? styles.active : ""} href='/feed'>Feed</Link>
                <Link className={ pathname === "/discover" ? styles.active : ""} href='/discover'>Discover</Link>
            </nav>
            
            <div className={styles.search}>
                <input type="search" placeholder="Search articles..."/>
                <button onClick={() => setNewFeed(true)}>+</button>
            </div>

        </header>
        {newFeed && (<AddFeed onClose={() => setNewFeed(false)} />)}
        </>
    )
}