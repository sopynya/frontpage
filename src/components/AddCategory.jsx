"use client";

import styles from "./addcategory.module.css";
import { useState } from "react";
import { useAppStore } from "@/store/appStore";

export default function AddCategory({ onClose }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const guest = useAppStore((s) => s.guest);
  const addCategoryLocal = useAppStore((s) => s.addCategory);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: name.trim(),
        color,
      };

      if (!payload.name) throw new Error("Name is required");

      if (guest) {
        const local = { id: crypto.randomUUID(), name: payload.name, color: payload.color };
        addCategoryLocal(local);
        onClose();
        return;
      }

      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create category");

      addCategoryLocal(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.bg}>
      <div className={styles.modal}>
        <p className={styles.close} onClick={onClose}>X</p>
        <h2>New Category</h2>
        <form className={styles.form} onSubmit={submit}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" required />

          <label>Color</label>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap'}}>
            {[
              { name: 'Pink', color: '#f472b6' },
              { name: 'Red', color: '#ef4444' },
              { name: 'Blue', color: '#3b82f6' },
              { name: 'Green', color: '#10b981' },
              { name: 'Brown', color: '#a16207' },
              { name: 'Grey', color: '#6b7280' },
              { name: 'Purple', color: '#8b5cf6' },
              { name: 'Orange', color: '#f59e0b' },
            ].map((c) => (
              <button
                key={c.color}
                type="button"
                onClick={() => setColor(c.color)}
                aria-label={c.name}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  border: color === c.color ? '3px solid #111827' : '1px solid #e5e7eb',
                  background: c.color,
                  padding: 0,
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
          <div className={styles.actions}>
            <button type="submit" disabled={loading} className={styles.create}>{loading ? 'Creating...' : 'Create'}</button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          {guest && <p className={styles.alert}>Log in to save your categories.</p>}
        </form>
      </div>
    </div>
  );
}
