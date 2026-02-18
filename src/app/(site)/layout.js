import Header from "@/components/Header";
import Providers from "../providers";
import Sidebar from "@/components/Sidebar";

export default function SiteLayout({children}) {
    return(
        <Providers>
            <Header />
            <Sidebar />
        </Providers>
    )
}