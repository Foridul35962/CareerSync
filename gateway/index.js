import dotenv from 'dotenv'
dotenv.config()
import app from "./src/app.js";

const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(`api gateway is running on http://localhost:${PORT}`)
})