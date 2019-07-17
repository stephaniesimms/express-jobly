/** GET / companies
This should return a the handle and name for all of the company objects.It should also allow for the following query string parameters
search.
This should return JSON of { companies: [companyData, ...] }
*/


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