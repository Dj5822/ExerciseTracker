import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import express from "express";
import api from "./routes";

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/*
Connect to the database.
*/
const mySecret =
  "mongodb+srv://dj5822:xjE8yXCkex1da5Ih@cluster0.cdewt.mongodb.net/ExerciseDatabase?retryWrites=true&w=majority";
mongoose
  .connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

/*
Used to load the starting webpage.
*/
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.use("/api", api);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
