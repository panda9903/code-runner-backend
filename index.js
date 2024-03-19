import connection from "./db/connection.js";
import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/submissions", (req, res) => {
  connection.query("SELECT * FROM code_submissions", (err, results) => {
    if (err) {
      console.error("Error fetching submissions: " + err.stack);
      res.status(500).send("Error fetching submissions");
    } else {
      console.log("Submissions fetched successfully", results);
      res.status(200).json(results);
    }
  });
});

app.post("/submissions", (req, res) => {
  console.log(req);
  console.log(req.body);
  const { code, code_language, stdin } = req.body;
  connection.query(
    "INSERT INTO code_submissions (code, code_language, stdin) VALUES (?, ?, ?)",
    [code, code_language, stdin],
    (err, results) => {
      if (err) {
        console.error("Error inserting submission: " + err.stack);
        res.status(500).send("Error inserting submission");
      } else {
        console.log("Submission inserted successfully", results);
        res.status(200).send("Submission inserted successfully");
      }
    }
  );
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
