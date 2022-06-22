import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import express from "express";
import api from "./routes";
import db from "../config/db.json";

const app = express();
const port: Number = db.PORT || 3000;

app.use(cors());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Connect to the database.
mongoose
  .connect(db.MONGO_URI)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

// Setup API endpoints.
app.use("/api", api);

app.listen(port, () => {
  console.log("Your app is listening on port " + String(port));
});
