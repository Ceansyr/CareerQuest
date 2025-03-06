import express from 'express';
import Job from '../models/job.js';
import errorHandler from '../middleware/errorHandler.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// list all jobs with filters for name and skills
//add pagination
router.get('/', async (req, res) => {
    const name = request.params.name || '';
    const skills = request.params.skills || [];
    const skillsArray = skills.split(',').map(skill => skill.trim());
    const size = req.params.size || 10;
    const offset = req.params.offset || 0;
    const jobs = await Job.find({
      $or : [
        { title: { $regex: name, $options: 'i' } },
        { skills: { $in: skillsArray } }
      ],
      $limit: size,
      $skip: offset
    });

    res.status(200).json(jobs);
});

//create a job
router.post('/', authMiddleware, async (req, res) => {
    try {
      const { title, description, company, location, salary, skills, remote, type } = req.body;
      const jobSkills = skills.split(',').map(skill => skill.trim());
      const newJob = new Job({ 
        title, 
        description, 
        company, 
        location, 
        salary, 
        skills: jobSkills, 
        remote, 
        type,
        createdBy: req.user._id
      });
      await newJob.save();
      res.status(200).json(newJob);
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

// edit a job
router.put('/:id', authMiddleware, async (req, res) => {
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
            message: 'You are not authorized to edit this job',
            status: 401
          }
         });
      }
      const { title, description, company, location, salary, skills, remote, type } = req.body;
      const jobSkills = skills.split(',').map(skill => skill.trim());
      const updatedJob = await Job.findByIdAndUpdate(req.params.id, { 
        title, 
        description, 
        company, 
        location, 
        salary, 
        skills: jobSkills, 
        remote, 
        type,
        updatedAt: Date.now()
      } , { new: true });
      res.status(200).json(updatedJob);
    }
    catch (error) {
      errorHandler(error, req, res);
    }
});


export default router;