/** Job class for jobly */
const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate")

class Job {

  /** Create a new job. Return an object containing all job data.
   Return { id:.., title:.., salary:.., equity:.., company_handle:.., date_posted:.. } */
  static async create({ title, salary, equity, company_handle }) {
    const result = await db.query(
      `INSERT INTO jobs (
        title,
        salary,
        equity,
        company_handle,
        date_posted)
      VALUES ($1, $2, $3, $4, current_timestamp)
      RETURNING id, title, salary, equity, company_handle, date_posted`,
      [title, salary, equity, company_handle]);
<<<<<<< HEAD
      console.log('result is', result.rows[0])
=======
    
>>>>>>> 02930cedf19db598488d285eed4486a0db05264f
      return result.rows[0];
  }

  /** Get all jobs. Return a list of job objects [{ title: ..., company_handle: ... }]
    or an empty list if no jobs exist */
  static async getAll() {
    const results = await db.query(
      `SELECT title, company_handle 
        FROM jobs
        ORDER BY date_posted DESC`);
    return results.rows;
  }

  /** Take query object from GET route and return any matching jobs based on query
   Return [{ title: ..., company_handle: ... }] */
  
   static async getBySearch(query) {
     let baseQuery = `SELECT title,  company_handle FROM jobs`;
     let values = Object.values(query);
  
     if (query.min_salary > query.max_salary) {
       const err = new Error(`Invalid query`);
       err.status = 400;
       throw err;
     }
 
     let whereClause = _createFinalWhereClause(query)
     let finalQuery = `${baseQuery} WHERE ${whereClause}`;
    
     let results = await db.query(finalQuery, values);
 
     if (results.rows.length === 0) {
       const err = new Error(`No matching companies.`);
       err.status = 404;
       throw err;
     }
     return results.rows;
   }
 
   /** accepts a key/query term and creates a single WHERE clause according to the key */
   static _createWhereClause(key, idx) {
     if (key === 'title') {
       let whereClauseTitle = `title ILIKE $${idx}`;
       return whereClauseTitle;
     } else if (key === "min_salary") {
       let whereClauseMin = `salary>=$${idx}`;
       return whereClauseMin;
     } else if (key === "company_handle") {
        let whereClauseHandle = `company_handle ILIKE $${idx}`
        return whereClauseHandle;
     }else if( key === "min_equity"){
        let whereClauseMinEquity = `equity>=$${idx}`;
        return whereClauseMinEquity;
     } else {
       let whereClauseMax = `salary<=$${idx}`
       return whereClauseMax;
     }
   }

  

  

  /** Return specific job based on id */
  static async getOne(id) {
    console.log(typeof id)
    const result = await db.query(
      `SELECT title, salary, equity, company_handle
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

// **********************************HELPER FUNCTION**************************************/

/** accepts query string object and generates WHERE clause for SQL */
function _createFinalWhereClause(query) {
  let idx = 1;
  let buildClause = [];

  for (let key in query) {
    let whereClause = Job._createWhereClause(key, idx++)
    buildClause.push(whereClause);
  }
  let finalWhereClause = buildClause.join(` AND `);

  return finalWhereClause;
}

module.exports = Job;