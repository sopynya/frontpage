import Header from "@/components/Header";
import Providers from "../providers";
import Sidebar from "@/components/Sidebar";
import { getUserIdFromToken } from "@/lib/auth"

export default async function SiteLayout({children}) {
    const userId = await getUserIdFromToken();

    let user = userId ? true : false;

    return(
        <Providers>
            <Header user={user}/>
            <div style={{display: "flex"}}>
                <Sidebar />
                {children}
            </div>
        </Providers>
    )
}