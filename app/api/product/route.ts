import { MongoClient, MongoClientOptions } from "mongodb";

// Fetch MongoDB URI from environment variables
const uri = process.env.MONGODB_URI!;
const options: MongoClientOptions = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Extend NodeJS.Global to include `_mongoClientPromise`
declare global {
  namespace NodeJS {
    interface Global {
      _mongoClientPromise?: Promise<MongoClient>;
    }
  }
}

// Ensure MongoDB URI is defined
if (!uri) {
  throw new Error("Please add your MongoDB URI to .env");
}

if (process.env.NODE_ENV === "development") {
  // Cast `global` to `NodeJS.Global` and handle `_mongoClientPromise`
  const globalNode = global as NodeJS.Global;
  if (!globalNode._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalNode._mongoClientPromise = client.connect();
  }
  clientPromise = globalNode._mongoClientPromise;
} else {
  // For production, create a new MongoClient instance
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// GET function to fetch products from the database
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("e-commerce");
    const collection = db.collection("product");

    // Fetch all products
    const products = await collection.find({}).toArray();

    // Return the products as JSON
    return new Response(JSON.stringify(products), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Ensure `error` is properly typed
    const err = error as { message?: string };
    return new Response(
      JSON.stringify({ error: err.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
