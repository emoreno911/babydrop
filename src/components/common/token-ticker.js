"use client"

import { useEffect, useState } from "react"

const TokenTicker = () => {
    const [price, setPrice] = useState(0)
    const [percent, setPercent] = useState(0)

    useEffect(() => {
        const url = "https://api.cryptorank.io/v0/tickers?isTickersForPriceCalc=true&limit=1&coinKeys=baby-doge-coin"
        fetch(url).then(r => r.json())
            .then(response => {
                setPrice(response.data[0].last.toString())
                setPercent(response.data[0].changePercent.toString())
            }).catch(err => {
                setPrice(0)
                setPercent(0)
            })
    }, [])

    return (
        <div className="w-full bg-slate-900 rounded-md p-5">
            <div className="flex gap-3 items-start pb-5">
                <img src="https://assets.coingecko.com/coins/images/16125/standard/babydoge.jpg?1696515731" className="rounded-full" alt="babydoge" />
                <div>
                    <div className="text-xl pb-1 font-semibold">BABYDOGE</div>
                    <div className="font-mono text-xl">
                        <span>${price}</span>
                        <span className="text-yellow-500 ml-2">{percent}%</span>
                    </div>
                </div>
            </div>
            
            <img src="https://www.coingecko.com/coins/16125/sparkline.svg" className="w-full h-20" alt="sparkline" />
        </div>
    )
}

export default TokenTicker