
const Router = require("express").Router;
const ExpressError = require("../helpers/expressError");
const {Company} = require("../models/company");

const jsonschema = require("jsonschema");
const companySchema = require("../schemas/companySchema.json");

const router = new Router();


/** GET / companies
Return the handle and name for all of the company objects
as JSON of { companies: [companyData, ...] }
*/
router.get('/', async function (req, res, next) {
  // branch out depending on req.query
  let companies;
  try {
    if (Object.keys(req.query).length === 0) {
      companies = await Company.getAll(); 
    } else {
      companies = await Company.getBySearch(req.query);
    }
  } catch (err) {
    return next(err);
  }
  return res.json({ companies });
});

/**
GET / companies / [handle]
Return a single company found by its id as JSON of { company: companyData }
*/
router.get('/:handle', async function (req, res, next) {
  try {
    const company = await Company.getOne(req.params.handle);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

/**  POST / companies
Create a new company and return the newly created company as JSON of { company: companyData }
*/
router.post('/', async function (req, res, next) {
  try {
    const validate = jsonschema.validate(req.body, companySchema);

    if (!validate.valid) {
      let listOfErrors = validate.errors.map(error => error.stack);
      throw new ExpressError(listOfErrors, 400);
    }
    
    const company = await Company.create(req.body);
    return res.status(201).json({ company }); 
  } catch (err) {
    return next(err);
  }
});

/**
PATCH / companies / [handle]
Update an existing company and return the updated company as JSON of { company: companyData }
 */
router.patch('/:handle', async function (req, res, next) {
  try {
    const validate = jsonschema.validate(req.body, companySchema);

    if (!validate.valid) {
      let listOfErrors = validate.errors.map(error => error.stack);
      throw new ExpressError(listOfErrors, 400);
    }
    const company = await Company.update(req.params.handle, req.body);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

/**
DELETE / companies / [handle]
Remove an existing company and return a message as JSON of { message: "Company deleted" }
*/
router.delete('/:handle', async function (req, res, next) {
  try {
    await Company.remove(req.params.handle);
    return res.json({ message: 'Company deleted' });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;