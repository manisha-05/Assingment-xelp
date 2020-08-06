const express = require("express");
const mysql = require("mysql");
const dotenv = require('dotenv')
const userRoute = require("./routes/userRoutes")

dotenv.config({ path: './.env' })
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MySQL Connected ");
  }
});

app.use(express.json())
app.use(userRoute)


app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
