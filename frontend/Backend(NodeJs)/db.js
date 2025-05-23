import mongoose from "mongoose";
import * as dotenv from "dotenv"
dotenv.config()

const connectionURL = process.env.MONGO_URL
console.log("connectionURL", connectionURL)
export const connectToDB = async() => {

  mongoose.connect(connectionURL, {}).then(() => {
    console.log("db connected successfully")
  }).catch((err) => {
    console.log(err)
  })

}