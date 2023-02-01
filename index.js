const express = require("express");
const model = require("./model");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const DBConnection = require("./DBconnection");
const upload = require("./upload");
const port = 8000;
dotenv.config();
const app = express();
DBConnection();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
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
