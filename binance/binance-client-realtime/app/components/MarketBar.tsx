"use client";
import { JSX, useEffect, useState } from "react";
import { Ticker } from "@/app/utils/types";
import { getTicker } from "@/app/utils/httpClient";
import { SignalingManager } from "../utils/SignalingManager";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Bitcoin, Ethereum, Doge, Solana, Cardano } from "./Icons"; 


export const MarketBar = ({market}: {market: string}) => {
    const [ticker, setTicker] = useState<Ticker | null>(null);

    useEffect(() => {
        getTicker(market).then(setTicker);
        SignalingManager.getInstance().registerCallback("ticker", (data: Partial<Ticker>)  =>  setTicker(prevTicker => ({
            firstPrice: data?.firstPrice ?? prevTicker?.firstPrice ?? '',
            high: data?.high ?? prevTicker?.high ?? '',
            lastPrice: data?.lastPrice ?? prevTicker?.lastPrice ?? '',
            low: data?.low ?? prevTicker?.low ?? '',
            priceChange: data?.priceChange ?? prevTicker?.priceChange ?? '',
            priceChangePercent: data?.priceChangePercent ?? prevTicker?.priceChangePercent ?? '',
            quoteVolume: data?.quoteVolume ?? prevTicker?.quoteVolume ?? '',
            symbol: data?.symbol ?? prevTicker?.symbol ?? '',
            trades: data?.trades ?? prevTicker?.trades ?? '',
            volume: data?.volume ?? prevTicker?.volume ?? '',
        })), `TICKER-${market}`);
        SignalingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`ticker.${market}`]}	);

        return () => {
            SignalingManager.getInstance().deRegisterCallback("ticker", `TICKER-${market}`);
            SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE","params":[`ticker.${market}`]}	);
        }
    }, [market])

//     return <div>
//         <div className="flex items-center flex-row relative w-full overflow-hidden border-b border-slate-800">
//             <div className="flex items-center justify-between flex-row no-scrollbar overflow-auto pr-4">
//                     <Tickers market={market} />
//                     <div className="flex items-center flex-row space-x-8 pl-4">
//                         <div className="flex flex-col h-full justify-center">
//                             <p className={`font-medium tabular-nums text-greenText text-md text-green-500`}>${ticker?.lastPrice}</p>
//                             <p className="fontchildren-medium text-sm text-sm tabular-nums">${ticker?.lastPrice}</p>
//                         </div>
//                         <div className="flex flex-col">
//                             <p className={`font-medium text-xs text-slate-400 text-sm`}>24H Change</p>
//                             <p className={` text-sm font-medium tabular-nums leading-5 text-sm text-greenText ${Number(ticker?.priceChange) > 0 ? "text-green-500" : "text-red-500"}`}>{Number(ticker?.priceChange) > 0 ? "+" : ""} {ticker?.priceChange} {Number(ticker?.priceChangePercent)?.toFixed(2)}%</p></div><div className="flex flex-col">
//                                 <p className="font-medium text-xs text-slate-400 text-sm">24H High</p>
//                                 <p className="text-sm font-medium tabular-nums leading-5 text-sm ">{ticker?.high}</p>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <p className="font-medium text-xs text-slate-400 text-sm">24H Low</p>
//                                     <p className="text-sm font-medium tabular-nums leading-5 text-sm ">{ticker?.low}</p>
//                                 </div>
//                             <button type="button" className="font-medium transition-opacity hover:opacity-80 hover:cursor-pointer text-base text-left" data-rac="">
//                                 <div className="flex flex-col">
//                                     <p className="font-medium text-xs text-slate-400 text-sm">24H Volume</p>
//                                     <p className="mt-1 text-sm font-medium tabular-nums leading-5 text-sm ">{ticker?.volume}
//                                 </p>
//                             </div>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>

// }


    return <div className="flex flex-row items-center m-1 bg-slate-900 h-[72px] rounded-lg">
        <div className="flex justify-between flex-row w-full gap-4">
            <div className="flex flex-row ml-4 shrink-0 gap-[32px]">
                <button>
                    <TickerButton market={market}></TickerButton>
                </button>
                <div className="flex items-center flex-row flex-wrap space-x-6 text-white">
                    <div className="flex flex-col h-full justify-center">
                        <div className="font-medium tabular-nums text-redText text-lg">{ticker?.lastPrice}</div>
                        <div className="font-medium text-baseTextHighEmphasis text-left text-sm tabular-nums">${ticker?.lastPrice}</div>
                    </div>
                </div>
                <div className="flex items-center flex-row flex-wrap space-x-6 text-white">
                    <div className="flex flex-col h-full justify-center">
                    <p className={`font-medium text-sm text-slate-400`}>24H Change</p>
                    <p className={` text-md items-center font-medium tabular-nums leading-5 text-sm text-greenText ${Number(ticker?.priceChange) > 0 ? "text-green-500" : "text-red-500"}`}>{Number(ticker?.priceChange) > 0 ? "+" : ""} {ticker?.priceChange} {Number(ticker?.priceChange) > 0 ? "+" : ""} {Number(ticker?.priceChangePercent)?.toFixed(2)}%</p></div><div className="flex flex-col">
                    </div>
                </div>
                <div className="flex items-center flex-row flex-wrap space-x-6 text-white">
                    <div className="flex flex-col h-full justify-center">
                        <p className="font-medium text-sm text-slate-400">24H High</p>
                        <p className="text-sm font-medium tabular-nums leading-5 text-md ">{ticker?.high}</p>
                    </div>
                </div>
                <div className="flex items-center flex-row flex-wrap space-x-6 text-white">
                    <div className="flex flex-col h-full justify-center">
                        <p className="font-medium text-sm text-slate-400">24H Low</p>
                        <p className="text-sm font-medium tabular-nums leading-5 text-md ">{ticker?.low}</p>
                    </div>
                </div>
                <div className="flex items-center flex-row flex-wrap space-x-6 text-white">
                    <div className="flex flex-col h-full justify-center">
                        <p className="font-medium text-sm text-slate-400">24H Volume</p>
                        <p className="text-sm font-medium tabular-nums leading-5 text-md ">{ticker?.volume}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
}


const TickerButton = ({market}: {market: string}) => {
    const IconComponent = marketIcons[market] || <Bitcoin />;
    const [toggle, setToggel] = useState(true);
  
    return (
      <button
        type="button"
        aria-expanded="false"
        className="flex items-center justify-between cursor-pointer rounded-xl bg-gray-800 p-2 hover:opacity-90 w-full"
      >
        <div className="flex flex-row items-center gap-2">
          <a href={`/trade/${market}`} className="flex flex-row items-center gap-2">
            <div className="flex items-center w-6 h-6">{IconComponent}</div>

            <p className="font-medium text-white">
              {market.replace("_", "/")}
            </p>
          </a>
        </div>
        <button>{toggle ? <ChevronDown className="text-gray-400" /> : <ChevronUp className="text-gray-400" />}</button>
        
      </button>
    );
  };

export const marketIcons: { [key: string]: JSX.Element } = {
    BTC_USDC: <Bitcoin />,
    ETH_USDC: <Ethereum />,
    SOL_USDC: <Solana />,
  };