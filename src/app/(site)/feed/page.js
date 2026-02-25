"use client";
import { useAppStore } from "@/store/appStore";
import { useState, useEffect, useMemo } from "react";
import styles from "./page.module.css";
import Sidebar from "@/components/Sidebar";

export default function FeedHome() {
    const guest = useAppStore((s) => s.guest);
    const typescreen = useAppStore((s) => s.typescreen);
    const gridLayout = useAppStore((s) => s.gridLayout);
    const searchQuery = useAppStore((s) => s.searchQuery);
    const readArticles = useAppStore((s) => s.readArticles);
    const digestMode = useAppStore((s) => s.digestMode);
    const setGridLayout = useAppStore((s) => s.setGridLayout);
    const markArticleAsRead = useAppStore((s) => s.markArticleAsRead);
    const markAllAsRead = useAppStore((s) => s.markAllAsRead);
    const setDigestMode = useAppStore((s) => s.setDigestMode);
    const items = useAppStore((s) => s.items);
    const categories = useAppStore((s) => s.categories);
    const feeds = useAppStore((s) => s.feeds);
    const saved = useAppStore((s) => s.saved);
    const toggleSaveArticle = useAppStore((s) => s.toggleSaveArticle);

    async function saveLayoutPref(layout) {
        setGridLayout(layout);
    }

    async function handleMarkAsRead(articleId) {
        markArticleAsRead(articleId);
        
        if (!guest) {
            try {
                await fetch("/api/articles/read", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ articleId }),
                });
            } catch (err) {
                console.error("Failed to mark as read:", err);
            }
        }
    }

    function handleRefresh() {
        // Trigger refetch of articles by calling the API
        fetch("/api/articles")
            .then((res) => res.json())
            .then((data) => {
                if (data && Array.isArray(data)) {
                    const { setItems } = useAppStore.getState ? useAppStore.getState() : {};
                    if (setItems) setItems(data);
                }
            })
            .catch((err) => console.error("Failed to refresh:", err));
    }

    function handleMarkAllAsRead() {
        markAllAsRead(filteredItems.map((item) => item.id));
        
        if (!guest) {
            try {
                filteredItems.forEach((item) => {
                    fetch("/api/articles/read", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ articleId: item.id }),
                    }).catch((err) => console.error("Failed to mark as read:", err));
                });
            } catch (err) {
                console.error("Failed to mark all as read:", err);
            }
        }
    }

    // Filter articles based on typescreen (category, feed, "All items" or "Saved")
    const filteredItems = useMemo(() => {
        let items_filtered = [];
        
        if (typescreen === "Saved") items_filtered = saved;
        else if (typescreen === "All items") items_filtered = items;
        else if (typescreen.startsWith("feed:")) {
            const feedId = typescreen.substring(5);
            items_filtered = items.filter((item) => item.feed_id === feedId);
        } else {
            const category = categories.find((c) => c.name === typescreen);
            if (!category) return [];
            items_filtered = items.filter((item) => item.category_id === category.id);
        }
        
        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            items_filtered = items_filtered.filter((item) =>
                item.title.toLowerCase().includes(query) ||
                item.feed_title.toLowerCase().includes(query)
            );
        }

        // Apply digest mode (sort by newest first)
        if (digestMode) {
            items_filtered = items_filtered.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
        }
        
        return items_filtered;
    }, [typescreen, items, categories, saved, searchQuery, digestMode]);

    const unreadCount = useMemo(() => {
        return filteredItems.filter((item) => !readArticles[item.id]).length;
    }, [filteredItems, readArticles]);

    // Get display title
    const getDisplayTitle = () => {
        if (typescreen.startsWith("feed:")) {
            const feedId = typescreen.substring(5);
            const feed = feeds.find((f) => f.id === feedId);
            return feed ? feed.title : typescreen;
        }
        return typescreen;
    };

    const displayTitle = getDisplayTitle();

    return(
        <div style={{display: 'flex'}}>
            <div className={styles.sidebar} style={{ display: useAppStore((s) => s.showSB) ? "block" : "none" }}>
                <Sidebar />
            </div>
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titlesection}>
                    <h1>{displayTitle}</h1>
                    <p>{unreadCount} unread</p>
                </div>

                <div className={styles.actionsection}>
                    <div className={styles.gridchoice}>
                        <button
                            onClick={() => saveLayoutPref("list")}
                            style={{
                                opacity: gridLayout === "card" ? 1 : 0.6,
                                background: 'transparent',
                                border: "none",
                                cursor: "pointer",
                                padding: 0
                            }}
                        >
                            <img src="/align.svg" alt="List view" />
                        </button>
                        <span className={styles.divisor} />
                        <button
                            onClick={() => saveLayoutPref("card")}
                            style={{
                                opacity: gridLayout === "card" ? 1 : 0.6,
                                background: 'transparent',
                                border: "none",
                                cursor: "pointer",
                                padding: 0
                            }}
                        >
                            <img src="/grid.svg" alt="Card view" />
                        </button>
                    </div>

                    <button 
                        className={`${styles.digestBtn} ${digestMode ? styles.active : ""}`}
                        onClick={() => setDigestMode(!digestMode)}
                    >
                        Digest
                    </button>
                    <button className={styles.refreshBtn} onClick={handleRefresh}>Refresh</button>
                    <button onClick={handleMarkAllAsRead}>Mark all as read</button>
                </div>
            </div>

            <div className={`${styles.articles} ${styles[gridLayout]}`}>
                {filteredItems.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No items found</p>
                    </div>
                ) : (
                    filteredItems.map((item) => {
                        const isSaved = saved.some((s) => s.id === item.id);
                        const isRead = readArticles[item.id];
                        return (
                            <div key={item.id} className={`${styles.article} ${!isRead ? styles.unread : ""}`}>
                            {item.feed_image && (
                                <img src={item.feed_image} alt={item.feed_title} className={styles.feedImage} />
                            )}
                            <h3>{item.title}</h3>
                            <p className={styles.source}>{item.feed_title}</p>
                            <div className={styles.articleFooter}>
                                <a 
                                    href={item.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className={styles.link}
                                    onClick={() => handleMarkAsRead(item.id)}
                                >
                                    Read more →
                                </a>
                                <button
                                    className={`${styles.saveBtn} ${isSaved ? styles.saved : ""}`}
                                    onClick={() => toggleSaveArticle(item)}
                                    title={isSaved ? "Remove from saved" : "Save article"}
                                >
                                    <img src="/bookmark.svg" alt={isSaved ? "Saved" : "Save"} />
                                </button>
                            </div>
                        </div>
                    );
                    })
                )}
            </div>
        </div>
        </div>
    )
}