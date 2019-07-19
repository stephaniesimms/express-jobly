const Router = require("express").Router;
const ExpressError = require("../helpers/expressError");
const Jobs = require("../models/job");

const jsonschema = require("jsonschema");
const jobPostSchema = require("../schemas/jobPostSchema.json");
const jobPatchSchema = require("../schemas/jobPatchSchema.json");

const router = new Router();


/** Jobs routes */

/** GET / jobs list all the titles and company handles for all jobs, 
 * as JSON of {jobs: [title, .., company_handle: ..]} */
router.get('/', async function (req, res, next) {
  // branch out depending on req.query
  let jobs;
  try {
    if (Object.keys(req.query).length === 0) {
      jobs = await Job.getAll();
    } else {
      jobs = await Job.getBySearch(req.query);
    }
  } catch (err) {
    return next(err);
  }
  return res.json({ jobs });
});

/** GET /jobs/[id] 
Returns a single job found by its id as JSON of {job: jobData} */
router.get('/:handle', async function (req, res, next) {
  try {
    const job = await Job.getOne(req.params.id);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

/** POST / jobs
Creates a new job and returns it as JSON of { job: jobData } */
router.post('/', async function (req, res, next) {
  try {
    const validate = jsonschema.validate(req.body, jobPostSchema);

    if (!validate.valid) {
      let listOfErrors = validate.errors.map(error => error.stack);
      throw new ExpressError(listOfErrors, 400);
    }

    const job = await Job.create(req.body);
    return res.status(201).json({ job });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /jobs/[id] updates a job by its ID.
 * Returns JSON of {job: jobData} */
router.patch('/:id', async function (req, res, next) {
  try {
    const validate = jsonschema.validate(req.body, jobPatchSchema);

    if (!validate.valid) {
      let listOfErrors = validate.errors.map(error => error.stack);
      throw new ExpressError(listOfErrors, 400);
    }
    const job = await Job.update(req.params.id, req.body);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

 /** DELETE /jobs/[id] deletes a job and returns a message as JSON of { message: "Job deleted" } */
router.delete('/:id', async function (req, res, next) {
  try {
    await Job.remove(req.params.id);
    return res.json({ message: 'Job deleted' });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;