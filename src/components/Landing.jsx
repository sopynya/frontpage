"use client";
import styles from './landing.module.css';
import Login from './Login';
import Register from './Register';
import { useState } from 'react';

export default function Landing() {
    const [login, setLogin] = useState(false);
    const [register, setRegister] = useState(false);

    return(
        <div className={styles.page}>
            <header className={styles.header}>
                <h1><img src="/icon.png" /> Frontpage</h1>
    
                <nav className={styles.nav}>
                    <button className={styles.guest}>Try as guest</button>
                    <button className={styles.auth} onClick={() => setRegister(true)}>Sign up</button>
                    <button className={styles.auth} onClick={() => setLogin(true)}>Log in</button>
                </nav>
            </header>
        
            <div className={styles.hero}>
                <p>
                  Frontpage is a customizable content hub that brings 
                  together RSS and Atom feeds into a clean, focused reading 
                  experience. <br/>Follow dev blogs, design publications, newsletters, 
                  changelogs, and more — and browse everything from a single, thoughtfully 
                  organized dashboard. 
                </p>
                <img src="/bg.png" />
            </div>
              <div className={styles.highlight}>
                <div className={styles.info}>
                  <h2>Unified Reading Dashboard</h2>
                  <p>
                    Bring all your RSS and Atom feeds into one elegant interface. 
                    Stay organized and scroll through everything in a single, 
                    distraction-free stream.
                  </p>
                </div>
        
                <div className={styles.info}>
                  <h2>Fully Customizable Feed</h2>
                  <p>
                    Choose exactly what you want to follow. Add, remove, and organize
                    sources to build a feed that reflects your interests — not an algorithm’s guess.
                  </p>
                </div>
        
                <div className={styles.info}>
                  <h2>Smart Digest & Discovery</h2>
                  <p>
                    Get a curated view of the most relevant 
                    posts and discover new sources based on what the community is adding.
                  </p>
                </div>
        
                <div className={styles.info}>
                  <h2>Track What Matters</h2>
                  <p>
                    Mark articles as read, revisit saved posts, and 
                    pick up right where you left off — so you never miss 
                    important updates again.
                  </p>
                </div>
              </div>
              <footer className={styles.footer}>
                <p>Images by <a href="https://www.freepik.com">Freepik</a></p>
              </footer>
              {login && (<Login onClose={() => setLogin(false)} />)}
                {register && (<Register onClose={() => setRegister(false)}/>)}
            </div>
    );
}