const express = require("express");
const model = require("./model");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const DBConnection = require("./DBconnection");
const upload = require("./upload");
const { spawn } = require("child_process");
const port = 8000;
dotenv.config();
const app = express();
DBConnection();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//code for data connection with python
const python_run = () => {
  const python = spawn("python", ["test.py", "hello world"]);
  console.log("Data send to pyhton");
  python.stdout.on("data", (data) => {
    console.log(`${data}`);
  });
  python.stderr.on("data", (data) => {
    console.error(`error: ${data}`);
  });
  python.on("close", (data) => {
    console.log(`Child Process exited with code: ${data}`);
  });
};

//Routes for all static files
app.use("/uploads", express.static("uploads"));

//Sending frontend
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/style", (req, res) => {
  res.sendFile(__dirname + "/styles.css");
});
app.get("/js", (req, res) => {
  res.sendFile(__dirname + "/index.js");
});

//getting image uploaded by user
app.post("/", (req, res) => {
  const data = req.body.data;
  console.log(data);
  if (data) {
    python_run();
  }
});

//to add persons
app.post("/person", upload.single("image"), async (req, res) => {
  const data = req.body;
  if (!data) {
    return res.status(404).json({
      success: false,
      message: "Please provide data",
    });
  }

  data.image = req.file.filename;

  await model.create(data);
  const allperson = await model.find();

  if (allperson.length === 0) {
    return res.status(404).json({
      message: "No person found",
    });
  }

  return res.status(200).json({
    data: allperson,
  });
});

//to show all persons

app.get("/person", async (req, res) => {
  const allperson = await model.find();
  if (allperson.length === 0) {
    return res.status(404).json({
      message: "No person present",
    });
  }

  return res.status(200).json({
    data: allperson,
  });
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
