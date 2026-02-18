"use client";

import Link from "next/link";
import styles from './header.module.css';
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    return(
        <header className={styles.header}>
            <nav className={styles.nav}>
                <h1><img src="/icon.png"/>Frontpage</h1>
                <Link className={pathname === "/feed" ? styles.active : ""} href='/feed'>Feed</Link>
                <Link className={ pathname === "/discover" ? styles.active : ""} href='/discover'>Discover</Link>
            </nav>
            
            <div className={styles.search}>
                <input type="search" placeholder="Search articles..."/>
                <button>+</button>
            </div>

        </header>
    )
}