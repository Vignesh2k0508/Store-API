require('dotenv').config()
require('express-async-errors')
// async erros


const express= require('express')
const app = express()


const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')


// middleware
app.use(express.json())

// routes 

app.get('/',(req,res)=>{
    res.send('<h1>Store api</h1><a href="/api/v1/products">Product route</a>')
})

app.use('/api/v1/products/',productsRouter)

// product route

app.use(notFoundMiddleware)
app.use(errorMiddleware)

const port = process.env.PORT || 3000

const start = async ()=>{
    try {
        // connectDB
        await connectDB(process.env.MONGO_URI)
        app.listen(port,console.log(`Server is listening port ${port}...`))
    } catch (error) {
        console.log(error);
        
    }
}
start()