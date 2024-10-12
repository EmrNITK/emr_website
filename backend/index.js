import dotenv from "dotenv"
dotenv.config({path:'./.env'})

import connectDB from "./db/db.js"
import app from "./app.js"

connectDB()
.then(()=>{
  const port=process.env.PORT || 3000;
  app.listen(port,()=>{
    console.log(`server is running at port ${port}`)
  })
})
.catch((err)=>{
  console.log("mongodb connection failed !!! :",err)
}) 
