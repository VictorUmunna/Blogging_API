const express = require("express");
const passport = require("passport");
const authRoute = require("./routes/authRoute");
const bodyParser = require("body-parser");
const userRoute = require("./routes/publicRoute");
const blogRoute = require("./routes/articleRoute");

require("./db").connectToMongoDB(); // Connect to MongoDB
require("dotenv").config();
require("./controllers/authenticationController");

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.json({ status: true });
});

app.use("/auth", authRoute);

app.use("/user", passport.authenticate("jwt", { session: false }), userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => {
  console.log(`Server started on PORT: http://localhost:${PORT}`);
});

module.exports = app;