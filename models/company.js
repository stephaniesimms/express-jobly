/** Company class for jobly */
const db = require("../db");


class Company {

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


  static async getCompanies(query) {

    let selectStatement = `SELECT handle, name FROM companies`;
    let finalQuery = '';



    if (query.min_length > query.max_length) {
      const err = new Error(`Invalid query`);
      err.status = 400;
      throw err;

    }

    let buildClause = [];
    let values = [];
    let idx = 1;

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
    console.log('here is final query', finalQuery)

    
    let results = await db.query(finalQuery, values)

    if (results.rows === []) {
      const err = new Error(`No matching companies.`);
      err.status = 404;
      throw err;
    }

    return results.rows;
  }



}

































module.exports = Company;