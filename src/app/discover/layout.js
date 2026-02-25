import Providers from "../providers";
import Header from "@/components/Header";
import { getUserIdFromToken } from "@/lib/auth";

export default async function DiscoverLayout({ children }) {
  const userId = await getUserIdFromToken();
  const user = userId ? true : false;

  return (
    <Providers>
      <Header user={user} />
      <div style={{ width: "100%" }}>{children}</div>
    </Providers>
  );
}
