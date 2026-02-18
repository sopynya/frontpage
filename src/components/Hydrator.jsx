"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/store/appStore";

export default function Hydrator({children}) {
    const hydrate = useAppStore((s) => s.hydrate);
    const setGuest = useAppStore((s) => s.setGuest);

    const { isLoading } = useQuery({
        queryKey: ["app"],
        queryFn: async () => {
            const res = await fetch("/api/me", { cache: "no-store" });
            if(!res.ok) {
                setGuest(true);
            }
            const data = await res.json();
            hydrate(data);
            setGuest(false);
            return data;
        }
    });

    if (isLoading) return <p>Loading...</p>;

    return children;
}