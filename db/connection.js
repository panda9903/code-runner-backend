import { createConnection } from "mysql";

var connection = createConnection({
  host: "SG-lapis-pearl-8286-8254-mysql-master.servers.mongodirector.com",
  user: "sgroot",
  password: "r2D^Pys4KempnjR7",
  database: "Submissions",
  port: 3306,
});

connection.connect(function (err) {
  if (err) {
    console.error("Database connection failed: " + err.stack);
  } else {
    console.log("Connected!");
  }
});

export default connection;
