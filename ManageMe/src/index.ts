import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv'
import compression from "compression";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import router from "./router/index";

dotenv.config()
const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(compression());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://krzysiekpalonek:JRTBbs8UriSE9CA4@cluster0.7stabnt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    );
    console.log("🛢️  Connected To Database");
  } catch (error) {
    console.log("⚠️ Error to connect Database", error);
  }

  app.listen(PORT, () => {
    console.log(`🗄️   Server is running http://localhost:3000: `);
  });
}

startServer();

mongoose.connection.on('error', (err) => {
  console.error(`⚠️ MongoDB connection error: ${err}`);
});


app.use('/',router())