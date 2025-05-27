import mongoose from "mongoose";

// Get the URI and Database name from environment variables
const uri = process.env.MONGODB_URI!;

// Append the database name to the URI
const fullUri =uri;
// console.log(fullUri);

const connection = mongoose
  .connect(fullUri)
  .then(() => {
    console.log("Database is connected successfully...");
  })
  .catch((err) => {
    console.log("Error connecting to database: " + err);
  });

export default connection;
