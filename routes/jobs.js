const Router = require("express").Router;
const ExpressError = require("../helpers/expressError");
const { Jobs } = require("../models/job");

const jsonschema = require("jsonschema");
const jobSchema = require("../schemas/jobSchema.json");

const router = new Router();


/** Jobs routes */


/** GET / jobs list all the titles and company handles for all jobs, ordered by the most recently posted jobs.It should also allow for the following query string parameters */

/** POST / jobs
Creates a new job and returns it as JSON of { job: jobData } */

