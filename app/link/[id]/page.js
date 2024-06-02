import AppLayout from "@/src/components/common/app-layout";
import DepositLink from "@/src/components/common/deposit-link";

export default function LinkPage({params}) {
    const {id} = params
    return (
        <AppLayout>
			<DepositLink id={id} />
		</AppLayout>
    );
}