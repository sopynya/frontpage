"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import guestJson from "@/data/sample.json";
import { transformGuestJson } from "@/lib/guestJson";
import { useAppStore } from "@/store/appStore";

export default function DiscoverPage() {
  const guest = useAppStore((s) => s.guest);
  const storeFeeds = useAppStore((s) => s.feeds || []);
  const addFeed = useAppStore((s) => s.addFeed);
  const searchQuery = useAppStore((s) => s.searchQuery || "");

  const [sampleFeeds, setSampleFeeds] = useState([]);

  useEffect(() => {
    const transformed = transformGuestJson(guestJson);
    setSampleFeeds(transformed.feeds || []);
  }, []);

  const merged = useMemo(() => {
    const map = new Map();

    // add user feeds first so we preserve user metadata
    storeFeeds.forEach((f) => {
      const key = f.site_rss || f.siteUrl || f.site_url || f.feedUrl || f.id;
      map.set(key, { ...f, __source: "user", __duplicate: false });
    });

    // add sample feeds; mark duplicates
    sampleFeeds.forEach((f) => {
      const key = f.site_rss || f.siteUrl || f.site_url || f.feedUrl || f.id;
      if (map.has(key)) {
        const existing = map.get(key);
        existing.__duplicate = true;
        existing.__source = existing.__source || "user";
      } else {
        map.set(key, { ...f, __source: "sample", __duplicate: false });
      }
    });

    const all = Array.from(map.values());

    // duplicates first, then user-only, then sample-only
    const duplicates = all.filter((f) => f.__duplicate);
    const userOnly = all.filter((f) => !f.__duplicate && f.__source === "user");
    const sampleOnly = all.filter((f) => !f.__duplicate && f.__source === "sample");

    return [...duplicates, ...userOnly, ...sampleOnly];
  }, [storeFeeds, sampleFeeds]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return merged;
    return merged.filter((f) => {
      return (
        (f.title && f.title.toLowerCase().includes(q)) ||
        (f.site_url && f.site_url.toLowerCase().includes(q)) ||
        (f.siteUrl && f.siteUrl.toLowerCase().includes(q)) ||
        (f.site_rss && f.site_rss.toLowerCase().includes(q))
      );
    });
  }, [merged, searchQuery]);

  async function handleAdd(feed) {
    // if it's already in store (user feed), do nothing
    const already = storeFeeds.some((f) => (f.site_rss || f.site_url) === (feed.site_rss || feed.site_url || feed.siteUrl));
    if (already) return;

    if (guest) {
      // add locally for guests
      const local = { ...feed, id: crypto.randomUUID(), site_rss: feed.site_rss || feed.siteUrl };
      addFeed(local);
    } else {
      try {
        const res = await fetch("/api/add/feed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: feed.site_rss || feed.site_url || feed.siteUrl }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to add feed");
        addFeed(data);
      } catch (err) {
        console.error("Failed to add feed:", err);
      }
    }
  }

  function feedImageSrc(f) {
    if (f.image_url) return f.image_url;
    if (f.feed_image) return f.feed_image;
    const url = f.site_url || f.siteUrl || f.site_rss || f.site_rss;
    try {
      const hostname = new URL(url).hostname;
      return `https://icons.duckduckgo.com/ip3/${hostname}.ico`;
    } catch (e) {
      return `/icon.png`;
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.controls}>
        <h2>Discover feeds</h2>
      </div>

      <div className={styles.feedList}>
        {filtered.map((f) => {
          const key = f.site_rss || f.siteUrl || f.site_url || f.feedUrl || f.id;
          const isAdded = storeFeeds.some((s) => (s.site_rss || s.site_url) === (f.site_rss || f.site_url || f.siteUrl));
          return (
            <div className={styles.feedCard} key={key}>
              <img className={styles.feedImage} src={feedImageSrc(f)} alt={f.title} />
              <div className={styles.feedMeta}>
                <p className={styles.feedTitle}>{f.title}</p>
                <p className={styles.feedUrl}>{f.site_url || f.siteUrl || f.site_rss}</p>
                <div>
                  <button className={`${styles.addBtn} ${isAdded ? 'added' : ''}`} onClick={() => handleAdd(f)} disabled={isAdded}>
                    {isAdded ? 'Added' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
