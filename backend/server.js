import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import express from "express";
import api from "./routes";
import db from "./config/db";

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Connect to the database.
mongoose
  .connect(db.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

// Setup API endpoints.
app.use("/api", api);

const listener = app.listen(db.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
