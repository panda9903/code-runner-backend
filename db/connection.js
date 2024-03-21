import { createConnection } from "mysql";

// Did not put the credentials in .env file so that you can test the connection

// use the following command and password to connect to the database in the terminal. Ensure that you have mysql installed.
// mysql -u sgroot -p -P 3306 -h SG-lapis-pearl-8286-8254-mysql-master.servers.mongodirector.com
// password: r2D^Pys4KempnjR7

// This database will be deleted after 30 days.

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
