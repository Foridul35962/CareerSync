import dotEnv from 'dotenv'
dotEnv.config()
import app from "./src/app.js";
import { startSendMailConsumer } from './src/consumer.js';

startSendMailConsumer()

const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log('utils service is running on', PORT)
})