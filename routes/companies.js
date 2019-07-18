
const Router = require("express").Router;
const router = new Router();
const Company = require("../models/company");
// const ExpressError = require("..helpers/expressError");

/** GET / companies
This should return the handle and name for all of the company objects.
It should also allow for the following query string parameters search.
This should return JSON of { companies: [companyData, ...] }
*/

router.get('/', async function (req, res, next) {
  // branch out depending on req.query
  if (Object.keys(req.query).length === 0) {
    try {
      const companies = await Company.getAll();
      return res.json({ companies });

    } catch (err) {
      return next(err);
    }
  } else {
    try {
      const companies = await Company.getBySearch(req.query);
      return res.json({ companies });

    } catch (err) {
      return next(err);
    }

  }

});

/**  POST / companies
This should create a new company and return the newly created company.
This should return JSON of { company: companyData }
*/


/**
GET / companies / [handle]
This should return a single company found by its id.
This should return JSON of { company: companyData }
*/

/**
PATCH / companies / [handle]
This should update an existing company and return the updated company.
This should return JSON of { company: companyData }
 */


/**
DELETE / companies / [handle]
This should remove an existing company and return a message.
This should return JSON of { message: "Company deleted" }
*/

module.exports = router;