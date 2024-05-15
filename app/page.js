import AppLayout from "@/src/components/common/app-layout";
import Link from "next/link";

export default function Home() {
    return (
        <AppLayout>
			<div className="w-full py-36 h-96 flex flex-col items-center">
				<p className="text-5xl font-semibold">Babydrop</p>
				<p className="text-xl py-8">Send BabyDoge to anyone without a wallet</p>

				<Link href={"/"}>
					<div className="box-home w-48 font-semibold border bg-purple-400 text-center rounded-md py-3 px-6">
						<span>Connect Wallet</span>
					</div>
				</Link>
			</div>
		</AppLayout>
    );
}
