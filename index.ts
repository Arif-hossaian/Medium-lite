import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import routes from "./routes/index"
dotenv.config()

// Middleware
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(morgan('dev'))
app.use(cookieParser())

//Routes
app.use("/api", routes.authRoute)

//databse
import "./config/database"

// server listenning
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log('Server is running on port', PORT)
})