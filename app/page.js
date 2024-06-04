import AppLayout from "@/src/components/common/app-layout";
import TokenInfo from "@/src/components/common/token-info";
import TokenTicker from "@/src/components/common/token-ticker";
import Link from "next/link";

export default function Home() {
    return (
        <AppLayout>
			<div className="w-full py-3 mx-auto flex flex-col items-center" style={{maxWidth:"520px"}}>
				<p className="dapp-title text-2xl pt-8 pb-5">Send BabyDoge to anyone using a simple link</p>

				<TokenTicker />
				<TokenInfo />
			</div>
		</AppLayout>
    );
}
