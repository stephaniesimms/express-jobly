/** Company class for jobly */
const db = require("../db");
const sqlForPartialUpdate = require('../helpers/partialUpdate');


class Company {

/** Get all companies with ability to filter by name, min, and/or max number 
 of employees based on search terms provided in the query string.
 */

  static async getCompanies(query) {

    let selectStatement = `SELECT handle, name FROM companies`;
    let finalQuery = '';
    
    // If the min_employees parameter is greater than the max_employees paramteter, 
    // respond with a 400 status and a message 
    if (query.min_employees > query.max_employees) {
      const err = new Error(`Invalid query`);
      err.status = 400;
      throw err;
    }

    let buildClause = [];
    let values = [];
    let idx = 1;
    
    // build SQL query based on any search terms provided in the query string 
    if (query.name) {
      buildClause.push(`name ILIKE $${idx}`);
      values.push(`%${query.name}%`);
      idx += 1;
    }

    if (query.min_employees) {   
      buildClause.push(`num_employees>=$${idx}`);
      values.push(Number(query.min_employees));
      idx += 1;
    }
    if (query.max_employees) {  
      buildClause.push(`num_employees<=$${idx}`);
      values.push(Number(query.max_employees));
      idx += 1;
    }

    let joinedClause = buildClause.join(` AND `);

    if (joinedClause.length === 0) {
      finalQuery = selectStatement;
    } else {
      finalQuery = selectStatement + ` WHERE ` + joinedClause;
    }
  
    let results = await db.query(finalQuery, values)

    if (results.rows.length === 0) {
      const err = new Error(`No matching companies.`);
      err.status = 404;
      throw err;
    }
    return results.rows;
  }


  /** Get a single company by its handle/id and return */

  //getCompany()




  /**  Create a new company and return it */

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
    // console.log("Company.create result", result);
    return result.rows[0];
  }



  /** Update a company and return it */

  // patch()



  /** Delete a company by its handle/id */

  // delete()

}

































module.exports = Company;