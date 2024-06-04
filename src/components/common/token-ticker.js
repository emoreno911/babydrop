const TokenTicker = () => {
    return (
        <div className="w-full bg-slate-900 rounded-md p-5">
            <div className="flex gap-3 items-start pb-5">
                <img src="https://assets.coingecko.com/coins/images/16125/standard/babydoge.jpg?1696515731" className="rounded-full" alt="babydoge" />
                <div>
                    <div className="text-xl pb-1 font-semibold">BABYDOGE</div>
                    <div className="font-mono text-xl">
                        <span>$0.00000000118</span>
                        <span className="text-red-500 ml-2">-0.2%</span>
                    </div>
                </div>
            </div>
            
            <img src="https://www.coingecko.com/coins/16125/sparkline.svg" className="w-full h-20" alt="sparkline" />
        </div>
    )
}

export default TokenTicker