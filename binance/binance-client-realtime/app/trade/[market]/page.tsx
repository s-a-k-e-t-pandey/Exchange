"use client";
import { MarketBar } from "@/app/components/MarketBar";
import { SwapUI } from "@/app/components/SwapUI";
import { TradeView } from "@/app/components/TradeView";
import { Depth } from "@/app/components/depth/Depth";
import { useParams } from "next/navigation";

export default function Page() {
    const { market } = useParams();

    return <div className="flex flex-row flex-1 overflow-hidden bg-slate-800">
        <div className="flex flex-col flex-1">
            <MarketBar market={market as string} />
            <div className="flex flex-row h-[580px] border-y border-slate-800">
                <div className="w-[1px] flex-col border-slate-800 border-l"></div>
                <div className="flex flex-col flex-1">
                    <TradeView market={market as string} />
                </div>
                <div className="flex flex-col w-[280px] overflow-hidden rounded-sm ">
                    <Depth market={market as string} /> 
                </div>
            </div>
        </div>
        <div className="w-[1px] flex-col border-slate-800 border-l"></div>
        <div className="">
            <div className="relative overflow-hidden flex flex-col  m-1">
                <SwapUI market={market as string} />
            </div>
        </div>
    </div>
}