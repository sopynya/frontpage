import { create } from "zustand";
export const useAppStore = create((set, get) => ({
    guest: false,

    categories: [],
    feeds: [],
    items: [],
    lastFetchedAt: {},
    saved: [],
    typescreen: "All items",
    gridLayout: "card", // "list", "card", "grid"
    searchQuery: "",
    readArticles: {}, // { articleId: true }
    digestMode: false,
    

  setGuest: (value) => set({ guest: value }),
  setTypeScreen: (value) => set({ typescreen: value }),
  setGridLayout: (layout) => set({ gridLayout: layout }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setDigestMode: (mode) => set({ digestMode: mode }),
  markArticleAsRead: (articleId) =>
    set((state) => ({
      readArticles: { ...state.readArticles, [articleId]: true },
    })),
  markAllAsRead: (articleIds) =>
    set((state) => {
      const newRead = { ...state.readArticles };
      articleIds.forEach((id) => {
        newRead[id] = true;
      });
      return { readArticles: newRead };
    }),
  setLastFetchedAt: (value) => set({ lastFetchedAt: value }),

  setItems: (items) => set({ items }),
  setSaved: (saved) => set({ saved }),
  setReadArticles: (map) => set({ readArticles: map }),

  setData: ({ categories, feeds }) =>
    set({ categories, feeds }),

  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category],
    })),
  addFeed: (feed) =>
    set((state) => ({
      feeds: [...state.feeds, feed],
    })),

  savePreference: (preference) =>
    set((state) => ({
      ...state,
      ...preference,
    })),

  toggleSaveArticle: async (article) => {
    const state = get();
    const savedArr = Array.isArray(state.saved) ? state.saved : [];
    const isSaved = savedArr.some((s) => s.id === article.id);

    if (state.guest) {
      // local-only
      if (isSaved) {
        set({ saved: savedArr.filter((s) => s.id !== article.id) });
      } else {
        set({ saved: [...savedArr, article] });
      }
      return;
    }

    // logged in: persist to DB via API
    try {
      const articleUrl = article.link || article.url || article.article_url || article.id;
      if (isSaved) {
        await fetch("/api/saved", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleUrl }),
        });
        set({ saved: savedArr.filter((s) => s.id !== article.id) });
      } else {
        await fetch("/api/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleUrl }),
        });
        set({ saved: [...savedArr, article] });
      }
    } catch (err) {
      console.error("Failed to toggle save on server:", err);
      // fallback to local toggle
      if (isSaved) set({ saved: savedArr.filter((s) => s.id !== article.id) });
      else set({ saved: [...savedArr, article] });
    }
  },
    
}))