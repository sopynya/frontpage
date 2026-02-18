import Header from "@/components/Header";
import Providers from "../providers";

export default function SiteLayout({children}) {
    return(
        <Providers>
            <Header />
        </Providers>
    )
}