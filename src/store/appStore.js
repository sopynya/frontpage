import { create } from "zustand";
export const useAppStore = create((set, get) => ({
    user: null,
    guest: true,
    feeds: [],

    hydrate: (data) => {
        set({
            user: data?.user ?? null,
            feeds: data?.feed ?? []
        })
    },
    
    setGuest: (data) => {
        set({guest: data})
    }
}))