import { MessageFromApi } from '../types/fromApi';
import {Orderbook, Fill, Order} from './Orderbook';
import fs from 'fs'



export const BASE_CURRENCY = "INR";

interface UserBalance {
    [key: string] : {
        available: number,
        locked: number
    }
}

export class Engine {
    private orderbook: Orderbook[] = [];
    private balances: Map<string, UserBalance> = new Map();

    constructor(){
        let snapshot = null
        try{
            if(process.env.snapshot){
                snapshot = fs.readFileSync('./snapshot.json');
            }
        }catch(e){
            console.log('No snapshot Found');
        }
        if(snapshot){
            const snapshotSnapshot = JSON.parse(snapshot.toString());
            this.orderbook = snapshotSnapshot.map((o: any) => new Orderbook(o.baseAsset, o.bids, o.asks, o.tradeId, o.currentPrice));
            this.balances = new Map(snapshotSnapshot.balances);
        }else{
            this.orderbook = [new Orderbook(`TATA`, [], [], 0, 0)];
            this.setBaseBalances();
        }
        setInterval(()=>{
            this.saveSnapshot();
        }, 1000 * 3);

    }
    saveSnapshot(){
        const snapshotSnapshot = {
            orderbooks: this.orderbook.map(o => o.getSnapshot()),
            balances: Array.from(this.balances.entries())
        }
        fs.writeFileSync("./snapshot.json", JSON.stringify(snapshotSnapshot));
    }


    process({message, clientId}: {message: MessageFromApi, clientId: string}){
        switch(message.type){
            case "CREATE_ORDER":

        }
    }

    addOrderbook(orderbook: Orderbook){
        this.orderbook.push(orderbook);
    }

    createOrder(market: string, price: string, quantity: string, side: 'buy' | 'sell', userId: string){
        const orderbook = this.orderbook.find(o => o.ticker() === market);
        const baseAsset = market.split("_")[0];
        const quoteAsset = market.split("_")[1];

        if(!orderbook){
            throw new Error("Orderbook not found");
        }

        this.checkNLockFunds(baseAsset, quoteAsset, price, quantity, side, userId, quantity);
    }

    checkAndLockFunds(baseAsset: string, quoteAsset: string, price: string, quantity: string, side: 'buy' | 'sell', userId: string){
        const userBalance = this.balances.get(userId) as UserBalance;
        if(side === 'buy'){
            if((this.balances.get(userId)?.[quoteAsset].available || 0) < Number(price) * Number(quantity)){
                throw new Error("Insufficient balance");
            }

            userBalance[quoteAsset].available = userBalance[quoteAsset].available - (Number(quantity) * Number(price));

            userBalance[quoteAsset].locked = userBalance[quoteAsset].locked + (Number(quantity) * Number(price));
        } else {
            if ((this.balances.get(userId)?.[baseAsset]?.available || 0) < Number(quantity)) {
                throw new Error("Insufficient funds");
            }
            userBalance[baseAsset].available = userBalance[baseAsset].available - (Number(quantity));
            
            userBalance[baseAsset].locked = userBalance[baseAsset].locked + Number(quantity);
        }
    }

    setBaseBalances(){
        this.balances.set("1", {
            [BASE_CURRENCY]: {
                available: 10000000,
                locked: 0
            },
            "TATA": {
                available: 10000000,
                locked: 0
            }
        })

        this.balances.set("2", {
            [BASE_CURRENCY]: {
                available: 10000000,
                locked: 0
            },
            "TATA": {
                available: 10000000,
                locked: 0
            }
        })

        this.balances.set("5", {
            [BASE_CURRENCY]: {
                available: 10000000,
                locked: 0
            },
            "TATA": {
                available: 10000000,
                locked: 0
            }
        })
    }
}