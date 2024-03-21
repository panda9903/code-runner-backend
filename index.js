import connection from "./db/connection.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

setInterval(function () {
  connection.query("SELECT 1");
}, 60000);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/submissions", (req, res) => {
  connection.query("SELECT * FROM code_submissions", (err, results) => {
    if (err) {
      console.error("Error fetching submissions: " + err.stack);
      res.status(500).send("Error fetching submissions");
    } else {
      //console.log("Submissions fetched successfully", results);
      res.status(200).json(results);
    }
  });
});

app.post("/submissions", async (req, res) => {
  //console.log(req);
  //console.log(req.body);
  const { code, code_language, stdin, username, stdout } = req.body;

  let code_language_id = 0;

  if (code_language === "python") {
    code_language_id = 71;
  }
  if (code_language === "cpp") {
    code_language_id = 54;
  }
  if (code_language === "java") {
    code_language_id = 62;
  }
  if (code_language === "javascript") {
    code_language_id = 93;
  }

  let statusOfCode = "";
  let outputofCode = "";

  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions",
    params: {
      base64_encoded: "true",
      wait: "true",
      fields: "*",
    },
    headers: {
      "content-type": "application/json",
      "Content-Type": "application/json",
      "X-RapidAPI-Key": "4b159e6853msh9954a7eba6073b4p1f88b4jsn40d55cd0c6e5",
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    },
    data: {
      language_id: code_language_id,
      source_code: btoa(code),
      stdin: btoa(stdin),
      stdout: btoa(stdout),
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data, " from judge0");
    //console.log(atob(response.data.source_code), " code from judge0");
    //console.log(atob(response.data.stdout), " output from judge0");

    //console.log(response.data.stderr, " error from judge0");
    //console.log(response.data.status, " status from judge0");

    statusOfCode = response.data.status.description.toString();
    outputofCode = atob(response.data.stdout).toString();

    if (statusOfCode !== "Accepted") {
      outputofCode = "";
    }

    console.log(statusOfCode, " status from judge0");
    console.log(outputofCode, " output from judge0");
  } catch (error) {
    console.error(error);
  }

  connection.query(
    "INSERT INTO code_submissions (code, code_language, stdin, username, status, output) VALUES (?, ?, ?, ?, ?, ?)",
    [code, code_language, stdin, username, statusOfCode, outputofCode],
    (err, results) => {
      if (err) {
        console.error("Error inserting submission: " + err.stack);
        res.status(500).send("Error inserting submission");
      } else {
        //console.log("Submission inserted successfully", results);
        res.status(200).send("Submission inserted successfully");
      }
    }
  );
});

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
