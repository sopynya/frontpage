"use client";

import Link from "next/link";

export default function Header() {

    return(
        <header>
            <nav>
                <h1>Frontpage</h1>
                <Link href='/feed'>Feed</Link>
                <Link href='/'>Discover</Link>
            </nav>
        </header>
    )
}