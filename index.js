const express = require("express");
const connectDB = require("./config/db");
const http = require("http");

//Connect Database
connectDB();

const app = express();
const server = http.createServer(app);

//Init middleware (Body Parser , now it s included with express )
app.use(express.json({ extended: false }));

// Define routes
app.use("/todo", require("./routes/api/todo"));

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader("Access-Control-Allow-Headers", "*");

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = server;
