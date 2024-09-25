const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: "../.env" });

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB: ", err));

// Simple route for testing
app.get("/", (req, res) => {
  res.send("API is running");
});

// Job routes
const jobsRouter = require("./routes/jobs");
app.use("/api/jobs", jobsRouter);

// Listen on port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
