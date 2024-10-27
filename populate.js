require('dotenv').config()

const connectDB = require('./db/connect')
const Product = require('./models/product')

const jsonProducts = require('./products.json')

const start = async() =>{
    try{
        await connectDB(process.env.MONGO_URI)
        await Product.deleteMany()
        await Product.create(jsonProducts)
        console.log('Success!!')
        process.exit(0) // exit method is used to stop this file from execution
    }catch(error){
        console.log(error);
        process.exit(1) // exit(1) - to run the file in execution when new error pitch in   
    }
}

start()