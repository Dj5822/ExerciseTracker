import cors from "cors";
import path from 'path';
import bodyParser from "body-parser";
import mongoose from "mongoose";
import express, {Express} from "express";
import api from "./routes";
import db from "../config/db.json";

const app: Express = express();
const port: Number = Number(process.env.PORT) || 3000;

app.use(cors());

// Setup JSON parsing for the request body
app.use(express.json());

// Setup our API routes.
app.use('/api', api);

// Make the "public" folder available statically
app.use(express.static(path.join(__dirname, 'public')));

// Setup API routes.
app.use("/api", api);

// Serve up the frontend's "build" directory, if we're running in production mode.
if (process.env.NODE_ENV === 'production') {
  console.log('Running in production!');

  // Make all files in that folder public
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // If we get any GET request we can't process using one of the server routes, serve up index.html by default.
  app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}

// Connect to the database.
mongoose.connect(db.MONGO_URI)
  .then(() => app.listen(port, () => {console.log(`Your app is listening on port ${port}`)}))
  .catch((err) => console.log(err));
