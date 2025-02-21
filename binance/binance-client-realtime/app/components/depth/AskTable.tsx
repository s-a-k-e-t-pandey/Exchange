import { Divide } from "lucide-react";


export function AskTable({ asks }: { asks: [string, string][] }){

    let currentTotal = 0;
    const relevantAsks = asks.slice(0, 15);
    console.log(relevantAsks)
    relevantAsks.reverse();

    let asksWithTotal: [string, string, number][] = [];
    for(let i=relevantAsks.length-1; i>=0; i--){
        const [price, quantity] = relevantAsks[i];
        asksWithTotal.push([price, quantity, currentTotal += Number(quantity)]);
    }
    const maxTotal = relevantAsks.reduce((acc, [_, quantity]) => acc + Number(quantity), 0);

    asksWithTotal.reverse();

    return <div className="text-white">
        {asksWithTotal.map(([price, quantity, total])=> <Ask price={price} quantity={quantity} total={total} maxTotal={maxTotal}/>)}
    </div>
}

function Ask({price, quantity, total, maxTotal}: {price: string, quantity: string, total: number, maxTotal: number}) {
    return <div
    style={{
        display: "flex",
        position: "relative",
        width: "100%",
        backgroundColor: "transparent",
        overflow: "hidden",
    }}
>
    <div
        style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: `${(100 * total) / maxTotal}%`,
        height: "100%",
        background: "rgba(228, 75, 68, 0.325)",
        transition: "width 0.3s ease-in-out",
        }}
    ></div>
    <div className="flex justify-between text-xs w-full">
        <div className="text-red-700 text-sm">
            {price}
        </div>
        <div>
            {quantity}
        </div>
        <div>
            {total?.toFixed(2)}
        </div>
    </div>
    </div>
}