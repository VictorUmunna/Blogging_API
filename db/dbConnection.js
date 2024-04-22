const mongoose = require("mongoose");
const CONFIG = require("./../config/config");

function DbConnection() {
  mongoose.connect(CONFIG.MONGODB_URL);
  mongoose.connection.on("connected", () => {
    console.log("Connection to MongoDB is successful");
  });
  mongoose.connection.on("error", (err) => {
    console.log("Unable to Connect to MongoDB");
  });
}

module.exports = DbConnection;