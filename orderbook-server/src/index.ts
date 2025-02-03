import express from 'express';
import { OrderInputSchema } from './types';
import { orderbook, bookWithQuantity } from './orderbook';
import { exec } from 'child_process';
import { flushCompileCache } from 'module';

const BASE_ASSET = 'BTC';
const QUOTE_ASSET = 'USD';

const app = express();
app.use(express.json());

let Global_Trade_Id = 0;

app.post('api/v1/order', async (req, res)=>{
    const order = OrderInputSchema.safeParse(req.body);
    if(!order.success){
        res.status(400).json(order.error.message);
        return;
    }
    const {baseAsset, quoteAsset, price, quantity, side, kind} = order.data;
    const orderId = getOrderId();

    if(baseAsset !== BASE_ASSET || quoteAsset !== QUOTE_ASSET){
        res.status(400).json('Invalid base or quote asset');
        return;
    }

    const {executedQty, fills} = fillOrder(orderId, price, quantity, side, kind);
    res.send({
        executedQty,
        fills,
        orderId
    });
});

app.listen(3000, ()=>{
    console.log('Server is running on port : 3000');
})

function getOrderId(){
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

interface Fill {
    price: number;
    qty: number;
    tradeId: number
}

function fillOrder(orderId: string, price: number, quantity: number, side:"buy" | "sell", type?: "ioc"): {status: "Accepted" | "Rejected"; executedQty: number; fills: Fill[]}{
    const fills: Fill[] = [];
    const maxFillQty = getFillAmount(price, quantity, side);
    let executedQty = 0;

    if(type === 'ioc' && quantity > maxFillQty){
        return {status: 'Rejected', executedQty: maxFillQty, fills: []};
    }
    if(side === 'buy'){
        orderbook.asks.forEach(o=>{
            if(o.price <= price && quantity > 0){
                const fillQty = Math.min(quantity, o.quantity);
                quantity -= fillQty;
                bookWithQuantity.asks[o.price] = (bookWithQuantity.asks[o.price] || 0) - fillQty;
                fills.push({
                    price: o.price,
                    qty: fillQty,
                    tradeId: Global_Trade_Id++
                })
                executedQty += fillQty;
                quantity -= fillQty;
                if(o.quantity === 0){
                    orderbook.asks.splice(orderbook.asks.indexOf(o), 1)
                }
                if(bookWithQuantity.asks[o.price]===0){
                    delete bookWithQuantity.asks[o.price];
                }
            }
        })
        if(quantity > 0){
            orderbook.bids.push({
                price,
                quantity : quantity - executedQty,
                side : 'bid',
                orderId
            })
        }bookWithQuantity.bids[price] = bookWithQuantity.bids[price] || 0 + quantity - executedQty;
    }
    else{
        orderbook.bids.forEach(o=>{
            if(o.price >= price && quantity > 0){
                const fillQty = Math.min(quantity, o.quantity);
                quantity -= fillQty;
                bookWithQuantity.bids[o.price] = (bookWithQuantity.bids[o.price] || 0) - fillQty;
                fills.push({
                    price: o.price,
                    qty: fillQty,
                    tradeId: Global_Trade_Id++
                })
                executedQty += fillQty;
                quantity -= fillQty;
                if(o.quantity === 0){
                    orderbook.bids.splice(orderbook.bids.indexOf(o), 1);
                }
                if(bookWithQuantity.bids[o.price]===0){
                    delete bookWithQuantity.bids[price];
                }
            }
        })
        if(quantity !== 0){
            orderbook.asks.push({
                price,
                quantity,
                side: "ask",
                orderId
            })
            bookWithQuantity.asks[price] = bookWithQuantity.asks[price] || 0 + quantity;
        }
    }
    return {
        status: 'Accepted',
        executedQty,
        fills
    }
}


function getFillAmount(price: number, quantity: number, side: "buy" | "sell"): number {
    let filled = 0;
    if (side === 'buy') {
        orderbook.asks.forEach(o => {
            if (o.price < price) {
                filled += Math.min(quantity, o.quantity);
            }
        });
    } else {
        orderbook.bids.forEach(o => {
            if (o.price > price) {
                filled += Math.min(quantity, o.quantity);
            }
        });
    }
    return filled;
}