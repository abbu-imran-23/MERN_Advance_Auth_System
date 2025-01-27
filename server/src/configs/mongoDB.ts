/******************* Imports *********************/
import mongoose from "mongoose";

/** MongoDB Connection **/
const connectDB = async () => {
  try {
    const instance = await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.info(`MongoDB connected: ${instance.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
