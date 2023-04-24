import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

// export const db = mysql.createConnection(process.env.DATABASE_URL);
// console.log("Connected to PlanetScale!");
// db.end();

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "MySQLadmin_12345",
  database: "weathrr",
});
