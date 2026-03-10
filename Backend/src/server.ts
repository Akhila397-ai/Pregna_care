import app from './app.js';
import dotenv from 'dotenv';
import { ConnectDB } from './config/db.js';


dotenv.config()

ConnectDB()
app.listen(process.env.PORT,()=>{
    console.log(`Server running on the port ${process.env.PORT}`)
});