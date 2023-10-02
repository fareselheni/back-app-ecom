import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import path from 'path';
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
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
    mongoose.connect(uri, { useNewUrlParser: true })
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
  }
}

export default new App().express
