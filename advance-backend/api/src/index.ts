import express from 'express'
import cors from 'cors'
import { depthRouter } from './routes/depth';
import { klineRouter } from './routes/kline';
import { tradesRouter } from './routes/trades';
import { orderRouter } from './routes/order';
import { tickersRouter } from './routes/ticker';

const app = express();
app.use(express.json());
app.use(cors());


app.use("/api/v1/order", orderRouter);
app.use("/api/v1/depth", depthRouter);
app.use("/api/v1/trades", tradesRouter);
app.use("/api/v1/klines", klineRouter);
app.use("/api/v1/tickers", tickersRouter);


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});