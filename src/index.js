import express from "express";
import dotenv from "dotenv";
dotenv.config();
import userRoute from "./routes/userRoute.js";
import connectDB from "./config/db.js";

const app = express();
const port = process.env.PORT || 8080;
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", userRoute);

app.get("/", (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Welcome to my API",
  });
});
app.use("/*", (req, res) => {
  return res.status(404).json({
    status: "Error",
    message: "url not found",
  });
});

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});
