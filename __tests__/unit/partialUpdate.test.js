const sqlForPartialUpdate = require('../../helpers/partialUpdate');

describe("partialUpdate()", () => {
  it("should generate a proper partial update query with just 1 field", function () {

    let result = sqlForPartialUpdate(
      'companies',
      { num_employees: 10 },
      'handle',
      'amazon'
    )
    expect(result['query']).toEqual(`UPDATE companies SET num_employees=$1 WHERE handle=$2 RETURNING *`);

    expect(result['values']).toEqual([10, 'amazon']);
    
  });

});



