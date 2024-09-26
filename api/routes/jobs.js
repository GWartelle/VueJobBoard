const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// GET all jobs (Corresponds to "/jobs" route in Vue)
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET one job by ID (Corresponds to "/jobs/:id" route in Vue)
router.get("/:id", getJob, (req, res) => {
  res.json(res.job);
});

// POST a new job (Corresponds to "/jobs/add" route in Vue)
router.post("/", async (req, res) => {
  const { type, title, description, salary, location, company } = req.body;

  const job = new Job({ type, title, description, salary, location, company });

  try {
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE one job by ID (Corresponds to "/jobs/edit/:id" route in Vue)
router.put("/:id", getJob, async (req, res) => {
  const { type, title, description, salary, location, company } = req.body;

  // Directly assign the values from req.body to the existing job document
  res.job.type = type;
  res.job.title = title;
  res.job.description = description;
  res.job.salary = salary;
  res.job.location = location;
  res.job.company = company;

  try {
    const updatedJob = await res.job.save();
    res.json(updatedJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE one job by ID (This route can be used from the JobView page)
router.delete("/:id", getJob, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware to get one job by ID (used in GET, UPDATE and DELETE routes)
async function getJob(req, res, next) {
  let job;
  try {
    job = await Job.findById(req.params.id);
    if (job == null) {
      return res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.job = job;
  next();
}

module.exports = router;
