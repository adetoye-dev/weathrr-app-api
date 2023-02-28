import mysql from "mysql";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "MySQLadmin_12345",
  database: "weathrr",
});
