const mongoose = require("mongoose"); // Import mongoose
const initData = require("./data.js"); // Import the initial data
const Listing = require("../models/Llisting.js"); // Import the Listing model

const MONGO_URL = "mongodb://localhost:27017/wonderlust";

main()
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDb = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "686154131a10222c86fcdcd0",
  }));
  console.log(initData.data);
  const insertedListings = await Listing.insertMany(initData.data);
  console.log(insertedListings);
  console.log("Data initialized!");
};

initDb();
