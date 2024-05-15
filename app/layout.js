import { Inter } from "next/font/google";
import { Providers } from "@/src/providers";
import { bodyThemeColors } from "@/src/lib/myutils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const metadata = {
    title: "Babydrop",
    description: "Send BabyDoge to anyone without a wallet",
    image: "https://bafybeihi3dcyudmk5wg6rx33dizn4tjlb2vpg36xsreoqyaeoruw555bju.ipfs.dweb.link",
    url: `https://babydrop.vercel.app`,
    sitename: "babydrop",
};

export default function RootLayout({ children }) {
    return (
        <html suppressHydrationWarning lang="en">
            {/* <link rel="shortcut icon" href="/favico.png" />
          <link rel="icon" href="/favico.png" /> */}
            <meta name="description" content={metadata.description} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={metadata.title} />
            <meta property="og:description" content={metadata.description} />
            <meta property="og:image" content={metadata.image} />
            <meta property="og:url" content={metadata.url} />
            <meta property="og:site_name" content={metadata.sitename} />
            <meta name="twitter:title" content={metadata.title} />
            <meta name="twitter:description" content={metadata.description} />
            <meta name="twitter:image" content={metadata.image} />

            <title>{metadata.title}</title>
            <body className={inter.className}>
                <Providers>
                    <div className={bodyThemeColors}>{children}</div>
                </Providers>
            </body>
        </html>
    );
}
