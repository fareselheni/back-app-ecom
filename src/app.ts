import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import path from 'path';
// import * as productRoutes from "./routes/product.routes"
const productRoutes = require("./routes/product.routes");
const authRoutes = require("./routes/auth.routes");

class App {
  public express: express.Application

  constructor() {
    this.express = express()
    this.cors()
    this.bodyparser()
    this.database()
    this.routes()
    this.staticFiles()
  }

  private database() {
    const uri: string = process.env.MONGODB_URI as string
    mongoose.connect("mongodb://127.0.0.1:27017/eCom", { useNewUrlParser: true })
  }

  private routes() {
    this.express.use("/product", productRoutes)
    this.express.use("/auth", authRoutes)
  }
  private cors() {
    this.express.use(cors({ origin: '*' }))
  }
  private bodyparser() {
    this.express.use(bodyParser.json())
  }
  private staticFiles(){
    this.express.use('/images', express.static(path.join(__dirname, 'public', 'images')));
    console.log("dirrrr",__dirname)

  }
}

export default new App().express
