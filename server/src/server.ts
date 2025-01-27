/******************* Imports *********************/
import app from "./app";
import connectDB from "./configs/mongoDB";

const PORT = process.env.PORT || 8000;

/** Start Server **/
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

startServer();
