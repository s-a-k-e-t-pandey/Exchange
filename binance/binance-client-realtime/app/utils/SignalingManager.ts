
import { initialize } from "next/dist/server/lib/render-server";
import { Ticker } from "./types";

const BASE_URL = "http://localhost:3000/backpack-api/api/v1";


export class SignalingManager{

    private ws : WebSocket;
    private static instance : SignalingManager;
    private bufferedMessages: any[] = [];
    private callbacks : {[type : string]: any} = {};
    private id : number;
    private initialized : Boolean = false

    private constructor(){
        this.ws = new WebSocket(BASE_URL);
        this.bufferedMessages = [];
        this.id = 1;
        this.init();
    }

    public static getInstance(){
        if(!this.instance){
            this.instance = new SignalingManager()
        }
        return this.instance;
    }

    init(){
        this.ws.onopen = ()=>{
            this.initialized = true;
            this.bufferedMessages.forEach(message => {
                this.ws.send(JSON.stringify(message));
            });
            this.bufferedMessages = []
        }
        this.ws.onmessage = (event)=>{
            const message = JSON.parse(event.data);
            const type = message.data.e;
            if(this.callbacks[type]){
                this.callbacks[type].forEach(({callbacks}: {callbacks: any})=>{
                    if(type == 'ticker'){
                        const newTicker : Partial<Ticker> = {
                            lastPrice: message.data.c,
                            high: message.data.h,
                            low:message.data.l,
                            volume: message.data.v,
                            quoteVolume: message.data.V,
                            symbol: message.data.s
                        }
                        callbacks(newTicker);
                    }
                })
            }
        }
    }
    sendMessage(message: any){
        const messageToSend = {
            ...message,
            id: this.id++
        }
        if(!this.initialized){
            this.bufferedMessages.push(messageToSend);
            return;
        }
        this.ws.send(JSON.stringify(messageToSend))
    }

    async registerCallback(type: string, callbacks: any, id: string){
        this.callbacks[type] = this.callbacks[type] || [];
        this.callbacks[type].push({callbacks, id})
    }

    async deRegisterCallback(type: string, id: string){
        if(this.callbacks[type]){
            const index = this.callbacks[type].findIndex(callback => callback.id === id);
            if(index != -1){
                this.callbacks[type].splice(index, 1);
            }
        }
    }
}