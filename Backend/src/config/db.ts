import mongoose from "mongoose";

export const ConnectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('DataBase connected')
    } catch (error) {
        console.log('Not connected..')
        process.exit(1)
    }

}


