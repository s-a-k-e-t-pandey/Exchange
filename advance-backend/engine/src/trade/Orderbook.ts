import {BASE_CURRENCY} from './Engine';



export interface Order {
    price: number,
    quantity: number,
    orderId: string,
    filled: number,
    userId: string,
    side: 'buy' | 'sell'
} 


export interface Fill {
    price: string,
    qty: number,
    tradeId: number,
    OtherUserId: string,
    marketOrderId: string
}


export class Orderbook {
    bids: Order[];
    asks: Order[];
    baseAsset: string;
    quoteAsset: string = BASE_CURRENCY;
    lastTradeId: number;
    currentPrice: number;

    constructor(baseAsset: string, bids: Order[], asks: Order[], lastTradeId: number, currentPrice: number) {
        this.bids = bids;
        this.asks = asks;
        this.baseAsset = baseAsset;
        this.lastTradeId = lastTradeId || 0;
        this.currentPrice = currentPrice ||0;
    }

    ticker(){
        return `${this.baseAsset}_${this.quoteAsset}`;
    }

    getSnapshot(){
        return {
            bids: this.bids,
            asks: this.asks,
            baseAsset: this.baseAsset,
            currentPrice: this.currentPrice,
            lastTrade: this.lastTradeId
        }
    }

    addOrder(order: Order): {
        executedQty: number,
        fills: Fill[]
    } {
        if(order.side === 'buy'){
            const {executedQty, fills} = this.matchBid(order);
            order.filled = executedQty;
            if(executedQty === order.quantity){
                return {
                    executedQty,
                    fills
                }
            }
            this.bids.push(order);
            return {
                executedQty,
                fills
            }
        } else {
            const {executedQty, fills} = this.matchAsk(order);
            order.filled = executedQty;
            if(executedQty === order.quantity){
                return {
                    executedQty,
                    fills
                }
            }
            this.asks.push(order);
            return {
                executedQty,
                fills
            }
        }
    }

    matchBid(order: Order): {fills: Fill[], executedQty: number} {
        const fills: Fill[] = [];
        let executedQty = 0;

        for(let i=0; i<this.asks.length; i++){
            if(this.asks[i].price <= order.price && executedQty < order.quantity) {
                const filledQty = Math.min(order.quantity - executedQty, this.asks[i].quantity);
                executedQty += filledQty;
                this.asks[i].filled += filledQty;
                fills.push({
                    price : this.asks[i].price.toString(),
                    qty: filledQty,
                    tradeId: this.lastTradeId++,
                    OtherUserId: this.asks[i].userId,
                    marketOrderId: this.asks[i].orderId
                });
            }
        }
        for(let i=0; i<this.asks.length; i++){
            if(this.asks[i].filled === this.asks[i].quantity){
                this.asks.splice(i, 1);
                i--;
            }
        }
        return {
            fills,
            executedQty
        };
    }
    
    matchAsk(order: Order): {fills: Fill[], executedQty: number}{
        const fills: Fill[] = [];
        let executedQty = 0;
        for(let i=0; i<this.bids.length; i++){
            if(this.bids[i].price >= order.price && executedQty < order.quantity){
                const amountRem = Math.min(order.quantity - executedQty, this.bids[i].quantity);
                executedQty += amountRem;
                this.bids[i].filled += amountRem;
                fills.push({
                    price: this.bids[i].price.toString(),
                    qty: amountRem,
                    tradeId: this.lastTradeId++,
                    OtherUserId: this.bids[i].userId,
                    marketOrderId: this.bids[i].orderId
                })
            }
        }
        for(let i=0; i<this.bids.length; i++){
            if(this.bids[i].filled === this.bids[i].quantity){
                this.bids.splice(i, 1);
                i--;
            }
        }
        return {
            fills,
            executedQty
        }
    }

    getDepth(){
        const bids: [string, string][] = [];
        const asks: [string, string][] = [];

        const bidsObj: {[key: string]: number} = {};
        const asksObj: {[key: string]: number} = {};

        for(let i=0; i<this.bids.length; i++){
            const order = this.bids[i];
            if(!bidsObj[order.price]){
                bidsObj[order.price] = 0;
            }
            bidsObj[order.price] += order.quantity;
        }

        for(let i=0; i<this.asks.length; i++){
            const order = this.asks[i];
            if(!asksObj[order.price]){
                asksObj[order.price] = 0;
            }
            asksObj[order.price] += order.quantity;
        }

        for(const price in bidsObj){
            bids.push([price, bidsObj[price].toString()]);
        }

        for(const price in asksObj){
            asks.push([price, asksObj[price].toString()]);
        }

        return {
            bids,
            asks
        }
    }

    getOpenOrders(order: Order){
        const asks = this.asks.filter(x => x.orderId === order.userId);
        const bids = this.bids.filter(x => x.orderId === order.userId);
        return [...asks, ...bids];
    }

    cancelBid(order: Order){
        const index = this.bids.findIndex(x => x.orderId === order.orderId);
        if(index === -1){
            const price = this.bids[index].price;
            this.bids.splice(index, 1);
            return price;
        }
    }
    cancelAsk(order: Order){
        const index = this.asks.findIndex(x => x.orderId === order.orderId);
        if(index === -1){
            const price = this.asks[index].price;
            this.asks.splice(index, 1);
            return price;
        }
    }
    
} 