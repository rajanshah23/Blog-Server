require('dotenv').config()
const express = require("express")
const app = express()
const cors = require('cors')
// ROUTES 
const userRoute = require("./routes/userRoute")
const blogRoute = require("./routes/blogRoute")
const { connectDatabase } = require("./database/database")
connectDatabase(process.env.MONGO_URI)
app.use(cors({
    origin : '*'
}))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static('uploads'))
 

app.get("/",(req,res)=>{
    res.send("<h1>Hey developer I am alive</h1>")
})



app.use("/api/user",userRoute)
app.use("/api/user",blogRoute)
 

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server has started at port  http://localhost:${PORT}`)
})



