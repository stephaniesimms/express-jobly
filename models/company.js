/** Company class for jobly */
const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate")

class Company {
  /** create new company. 
   * Return  { handle: ..., name: ... , num_employees, description, logo_url...} */
  static async create({ handle, name, num_employees, description, logo_url }) {

    // check for duplicate company by searching for handle, if found throw error
    let checkForCompany = await db.query(
      `SELECT handle, name 
      FROM companies
      WHERE handle=$1`,
      [handle]);

    if (checkForCompany.rows.length > 0) {
      const err = new Error(`Company already exists`);
      err.status = 400;
      throw err;
    }

    const result = await db.query(
      `INSERT INTO companies (
        handle,
        name,
        num_employees,
        description,
        logo_url)
      VALUES ($1, $2, $3, $4, $5)
       RETURNING handle, name, num_employees, description, logo_url`,
      [handle, name, num_employees, description, logo_url]);

    return result.rows[0];
  }

  /** Return all companies [{ handle: ..., name: ... }] or an empty array if none exist
  */
  static async getAll() {
    let results = await db.query(`SELECT handle, name FROM companies`);
    return results.rows;
  }

  /** Take query object from GET route and return any matching companies based on the query 
   * Return [{ handle: ..., name: ... },,,]
  */
  static async getBySearch(query) {
    let baseQuery = `SELECT handle, name FROM companies`;

    let values = Object.values(query);

    if (query.min_employees > query.max_employees) {
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
    if (key === 'name') {
      let whereClauseName = `name ILIKE $${idx}`;
      return whereClauseName;

    } else if (key === "min_employees") {
      let whereClauseMin = `num_employees>=$${idx}`;
      return whereClauseMin;

    } else {
      let whereClauseMax = `num_employees<=$${idx}`
      return whereClauseMax;
    }
  }

  /** Return specific company based on handle*/
  static async getOne(handle) {
    let result = await db.query(
      `SELECT handle, name, num_employees, description, logo_url
        FROM companies
        WHERE handle=$1`,
        [handle]);

    if (result.rows.length === 0) {
      const err = new Error(`No company found.`);
      err.status = 404;
      throw err;

    }
    return result.rows[0];
  }

  /** Update existing company with any provided data */
  static async update(handle, data) {
    let { query, values } = sqlForPartialUpdate("companies", data, "handle", handle)
    let result = await db.query(query, values);
    if (result.rows.length === 0) {
      const err = new Error(`No companies found`);
      err.status = 404;
      throw err;
    }
    return result.rows[0]
  }
  
  /**Delete specific company based on handle */
  static async remove(handle){
    const result = await db.query(
      `DELETE FROM companies 
         WHERE handle = $1 
         RETURNING handle`,
      [handle]);
    
      if (result.rows.length === 0) {
      const err = new Error(`No companies with the handle`);
      err.status = 404;
      throw err;
    }
    return result.rows[0];
  }

}

// **********************************HELPER FUNCTION**************************************/

/** accepts query string object and generates WHERE clause for SQL */
function _createFinalWhereClause(query) {
  let idx = 1;
  let buildClause = [];

  for (let key in query) {
    let whereClause = Company._createWhereClause(key, idx++)
    buildClause.push(whereClause);
  }
  let finalWhereClause = buildClause.join(` AND `);

  return finalWhereClause;
}


module.exports = {
  Company,
  _createFinalWhereClause
};






