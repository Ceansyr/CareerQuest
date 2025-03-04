import express from 'express';
import Job from '../models/job.js';
import errorHandler from '../middleware/errorHandler.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// list all jobs
router.get('/', async (req, res) => {
    const jobs = await Job.find();
    res.status(200).json(jobs);
});

//create a job
router.post('/', authMiddleware, async (req, res) => {
    try {
      const { title, description, company, location, salary, date } = req.body;
      const jobSkills = req.body.skills.split(',').map(skill => skill.trim());
      const newJob = new Job({ title, description, company, location, salary, date, skills: jobSkills });
      await newJob.save();
      res.status(201).json(newJob);
    }
    catch (error) {
      errorHandler(error, req, res);
    }
});

//get a job by id
router.get('/:id', async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) {
        return res.status(404).json({ 
          error: {
            message: 'Job not found',
            status: 404
          }
         });
      }
      res.status(200).json(job);
    }
    catch (error) {
      errorHandler(error, req, res);
    }
});

//delete a job by id
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) {
        return res.status(404).json({ 
          error: {
            message: 'Job not found',
            status: 404
          }
         });
      }
      if ( job.createdBy.toString() !== req.user._id.toString() ) {
        return res.status(401).json({ 
          error: {
            message: 'You are not authorized to delete this job',
            status: 401
          }
         });
      }
      await job.remove();
      res.status(200).json({ 
        message: 'Job deleted successfully'
       });
    }
    catch (error) {
      errorHandler(error, req, res);
    }
});


export default router;