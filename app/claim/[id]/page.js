import ClaimPage from "@/src/components/claim/claim-page";
import AppLayout from "@/src/components/common/app-layout";

export default function Claim({params}) {
    const { id } = params
    return (
        <AppLayout>
			<ClaimPage id={id} />
		</AppLayout>
    );
}