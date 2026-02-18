"use client";
import { useState } from "react";
import styles from "./login.module.css";
export default function Register({onClose}) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")

    async function handleRegister(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        if (res.ok) {
            setLoading(false);
            window.location.href = "/discover"
        } else {
            setLoading(false);
            setError(await res.error);
        }
    }
    return(
        <div className={styles.bg}>
            <div className={styles.auth}>
                <p className={styles.close} onClick={onClose}>X</p>
                <h2>Sign Up</h2>
                <form onSubmit={handleRegister} className={styles.form}>
                    <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required/>
                    <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required/>
                    <button type='submit' disabled={loading}>{loading ? 'Loading...' : 'Register'}</button>
                </form>
                {error && (<p className={styles.error}>{error}</p>)}
            </div>
        </div>
    )
}