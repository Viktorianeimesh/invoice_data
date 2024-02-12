require("dotenv").config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const router = require("./routers");
const { CLIENT_URL, PORT } = require("./envConfig");
const { sequelize } = require("./databaseConfig");

const server = express();

server.use(express.json());
server.use(cookieParser());
server.use(cors({
  credentials: true,
  origin: CLIENT_URL
}));
server.use(fileUpload());
server.use(router);

// Serve static files from the client/build directory
server.use(express.static(path.join(__dirname, 'client/build')));

server.use((req, res, next) => {
  res.setHeader("X_Frame-Options", "DENY");
  next();
});

sequelize.authenticate()
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(err => {
    console.log("Unable to connect to the database", err)
  });

const start = async () => {
  try {
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch ({ message }) {
    console.error(`Server error: ${message}`);
  }
};

start();
