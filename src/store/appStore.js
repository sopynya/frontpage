import { create } from "zustand";
export const useAppStore = create((set, get) => ({
    guest: false,

  categories: [],
  feeds: [],

  setGuest: (value) => set({ guest: value }),

  setData: ({ categories, feeds }) =>
    set({ categories, feeds }),

  addFeed: (feed) =>
    set((state) => ({
      feeds: [...state.feeds, feed],
    })),

    
}))