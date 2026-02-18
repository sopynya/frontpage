export const dynamic = "force-dynamic";
import { redirect } from "next/navigation"
import { getUserIdFromToken } from "@/lib/auth"
import Landing from "@/components/Landing"

export default async function Home() {
  const user = await getUserIdFromToken();

  if (user) {
    redirect("/feed");
  }

  return <Landing />
}
