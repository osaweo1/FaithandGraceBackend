require('dotenv').config()
const express=require('express')
const router = require('./server/routes/route')
const cors=require('cors')
const cookies=require('cookie-parser')
const cookieParser = require('cookie-parser')

const port =process.env.PORT||5000
const app=express()


app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin:["http://localhost:3000",
            'https://faith-grace.onrender.com'
            
],
    credentials:true,
    // optionsSuccessStatus :200
}))
app.use(express.json())
app.use(router)




app.use(cookieParser())










app.listen(port,()=>{console.log(`Server is Listening at port: ${port}`)})