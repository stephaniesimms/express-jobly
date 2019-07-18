/** Company class for jobly */
const db = require("../db");


class Company {
  /** create new company. 
   * Return  [{ handle: ..., name: ... , num_employees, description, logo_url...}] */
  static async create({ handle, name, num_employees, description, logo_url }) {
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

  /**Return all companies 
   * [{ handle: ..., name: ... },,,]
  */
  static async getAll() {

    let results = await db.query(`SELECT handle, name FROM companies`)
    if (results.rows.length === 0) {
      const err = new Error(`No companies found`);
      err.status = 404;
      throw err;
    }

    return results.rows;
  }

/**take query object return any matching companies with the query 
 * Return [{ handle: ..., name: ... },,,]
*/
  static async getBySearch(query) {
    let baseQuery = `SELECT handle, name FROM companies`

    let values = Object.values(query)

    if (query.min_employees > query.max_employees) {
      const err = new Error(`Invalid query`);
      err.status = 400;
      throw err;
    }

    let whereClause = createFinalWhereClause(query)
    let finalQuery = `${baseQuery} WHERE ${whereClause}`

    let results = await db.query(finalQuery, values);
    
    if (results.rows.length === 0) {
      const err = new Error(`No matching companies.`);
      err.status = 404;
      throw err;
    }

    return results.rows;

  }

}

// **********************************HELPER FUNCTION**************************************/

/** take object of query return string of where clause*/
function createFinalWhereClause(query) {
  let idx = 1;
  let buildClause = [];
  for (let key in query) {
    let whereClause = createWhereClause(key, idx)
    buildClause.push(whereClause)
    idx++
  }
  let finalWhereClause = buildClause.join(` AND `);

  return finalWhereClause
}

/**take a key and create single where clause according to the key */
function createWhereClause(key, idx) {

  if (key === 'name') {
    let whereClauseName = `name ILIKE $${idx}`;
    return whereClauseName

  } else if (key === "min_employees") {
    let whereClauseMin = `num_employees>=$${idx}`;
    return whereClauseMin

  } else {
    let whereClauseMax = `num_employees<=$${idx}`

    return whereClauseMax

  }
}

module.exports = Company;





