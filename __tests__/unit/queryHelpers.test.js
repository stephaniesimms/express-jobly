const { _createFinalWhereClause, Company } = require('../../models/company');

describe("_createWhereClause()", () => {
  it("should generate proper WHERE clause", function () {
    
    let result = Company. _createWhereClause("name", 1)
    expect(result).toEqual(`name ILIKE $1`);

  });

});

describe("_createFinalWhereClause()", () => {
  it("should generate proper WHERE clause for two query parameters", function () {

    let result = _createFinalWhereClause({ "name": "amazon", "min_employees": 10 })
    expect(result).toEqual(`name ILIKE $1 AND num_employees>=$2`);

  });

});
