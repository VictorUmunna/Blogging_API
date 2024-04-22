const http = require("http");

const app = require("./app");

const config = require("./config/config");

const PORT = config.PORT || 5000;

const connectToDb = require("./db/dbConnection");
connectToDb();

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is listening at port: ${PORT}`);
});