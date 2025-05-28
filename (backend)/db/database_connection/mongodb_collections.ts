import mongoose from "mongoose";

const uri = process.env.MONGODB_URI!;

const fullUri = uri;

const connection = mongoose
  .connect(fullUri)
  .then(() => {
    console.log("Database is connected successfully...");
  })
  .catch((err) => {
    console.log("Error connecting to database: " + err);
  });

export default connection;
