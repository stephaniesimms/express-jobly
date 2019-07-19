/** Job class for jobly */
const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate")

class Job {

  /** Create a new job. Return an object containing all job data.
   Return { id:.., title:.., salary:.., equity:.., company_handle:.., date_posted:.. } */
  static async create({ title, salary, equity, company_handle }) {
    // check for duplicate job by searching for ???, if found error
    // let checkForJob = await db.query(
    //   `SELECT title 
    //     FROM jobs
    //     WHERE title=$1`,
    //     [title]);
    // )
    // if (checkForJob.rows.length > 0) {
    //   const err = new Error(`Job already exists`);
    //   err.status = 400;
    //   throw err;
    // }

    const result = await db.query(
      `INSERT INTO jobs (
        title,
        salary,
        equity,
        company_handle)
      VALUES ($1, $2, $3, $4)
      RETURNING id, title, salary, equity, company_handle, date_posted`,
      [title, salary, equity, company_handle]);

      return result.rows[0];
  }

  /** Get all jobs. Return a list of job objects [{ title: ..., company_handle: ... }]
    or an empty list if no jobs exist */
  static async getAll() {
    const results = await db.query(`SELECT title, company_handle FROM jobs`);
    return results.rows;
  }

  /** Take query object from GET route and return any matching jobs based on query
   Return [{ title: ..., company_handle: ... }] */
  static async getBySearch(query) {

  }

  

  /** Return specific job based on id */
  static async getOne(id) {
    const result = await db.query(
      `SELECT title, salary, equity, company_handle, date_posted
        FROM jobs
        WHERE id=$1`,
      [id]);

    if (result.rows.length === 0) {
      const err = new Error(`No job found`);
      err.status = 404;
      throw err;
    }
    return result.rows[0];
  }

  /** Update existing job with any provided data */
  static async update(id, data) {
    let { query, values } = sqlForPartialUpdate("jobs", data, "id", id)
    let result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      const err = new Error(`No jobs found`);
      err.status = 404;
      throw err;
    }
    return result.rows[0]
  }

  /** Delete specific job based on id */
  static async remove(id) {
    const result = await db.query(
      `DELETE FROM jobs 
         WHERE id=$1 
         RETURNING id`,
      [id]);

    if (result.rows.length === 0) {
      const err = new Error(`No companies with the id`);
      err.status = 404;
      throw err;
    }
    return result.rows[0];
  }

};


module.exports = Job;