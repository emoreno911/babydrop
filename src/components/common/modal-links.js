import { useRouter } from "next/router";
import { listDeposits } from "@/src/lib/myutils";
import Modal from "../common/modal";


const ModalMyLinks = ({ buttonText }) => {
    //const router = useRouter()
	const localDeposits = listDeposits()
    const showLink = async (row) => {
        const [a,t,id] = row.split("|")
        //console.log(`${window.location.origin}/link/${id.trim()}`)
        window.location.replace(`${window.location.origin}/link/${id.trim()}`)
        // router.push(`/link/${id.trim()}`)
    }

	return (
		<Modal
			activator={({ setShow }) => (
				<button 
                    type="button" 
                    className="flex-grow text-center text-md px-5 py-2 text-white rounded-md bg-blue-500 focus:outline-none"
                    onClick={() => setShow(true)}
                > 
                    <span className="block mx-auto">{ buttonText }</span>    
                </button>
			)}
		>
			<div className="bg-slate-700 pt-4 pb-8 px-8 rounded-md text-white">
                <h4 className=" text-xl my-3">Your Generated Links</h4>
                <div className="w-full relative my-5">
                {
                    localDeposits.length === 0 && (
                        <div className=" text-lg text-gray-400 py-5">You haven't generated any links yet!</div>
                    )
                }
                {
                    localDeposits.map(row => (
                        <div key={row} className="flex items-center gap-2 mb-2">
                            <div>{row}</div>
                            <div>
                                <button
                                    type="button"
                                    className="box-home font-semibold text-white text-xs bg-blue-500 text-center rounded-md py-1 px-6"
                                    onClick={() => showLink(row) }
                                >
                                    Show Link
                                </button>
                            </div>
                        </div>
                    ))
                } 
                </div>
			</div>
		</Modal>
	)
}

export default ModalMyLinks