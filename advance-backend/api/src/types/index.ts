export const CREATE_ORDER = 'CREATE_ORDER';
export const CANCEL_ORDER = 'CANCEL_ORDER';
export const ON_RAMP = 'ON_RAMP';
export const GET_DEPTH = "GET_DEPTH";
export const GET_OPEN_ORDERS = "GET_OPEN_ORDERS";


export type MessageFromOrderbook = {
    type: "DEPTH",
    payload: {
        market: string,
        asks: [string, string][],
        bids: [string, string][]
    }
} | {
    type : "ORDER_PLACED",
    payload: {
        orderId : string,
        executedQty: string,
        fills: [
            {
                price: string,
                qty: string,
                tradeId: string
            }
        ]
    }
} | {
    type : "ORDER_CANCELLED",
    payload: {
        orderId: string,
        executedQty: string,
        remainingQty: string
    }
} | {
    type : "OPEN_ORDERS",
    payload: {
        orderId: string,
        executedQty: string,
        price: string,
        quantity: string,
        side: "buy" | "sell", 
        userId: string
    }[]
}