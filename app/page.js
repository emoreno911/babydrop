import AppLayout from "@/src/components/common/app-layout";
import TokenInfo from "@/src/components/common/token-info";
import Link from "next/link";

export default function Home() {
    return (
        <AppLayout>
			<div className="w-full py-12 h-96 flex flex-col items-center">
				<p className="text-5xl font-semibold">Babydrop</p>
				<p className="text-xl py-8">Send BabyDoge to anyone using a simple link</p>

				<TokenInfo />
			</div>
		</AppLayout>
    );
}
