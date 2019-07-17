const Company = require("../../models/company")

const db = require("../../db");



describe("Test Company Class", function () {
  beforeEach(async function () {
    await db.query("DELETE FROM companies");

    let c1 = await Company.create({
      handle: "amazon",
      name: "Amazon",
      num_employees: 3000000,
      description: "Online market place and AWS",
      logo_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWYikqi0wGu6e_BLcEcDtINNitmXY_8aKKUsokN3dCeZ3gCF8o"
    });
  
    let c2 = await Company.create({
      handle: "apple",
      name: "Apple",
      num_employees: 1000000,
      description: "Hip computers and stuff",
      logo_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWYikqi0wGu6e_BLcEcDtINNitmXY_8aKKUsokN3dCeZ3gCF8o"
    });

    let c3 = await Company.create({
      handle: "rithm",
      name: "Rithm",
      num_employees: 8,
      description: "Best bootcamp",
      logo_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWYikqi0wGu6e_BLcEcDtINNitmXY_8aKKUsokN3dCeZ3gCF8o"
    });
  });



  test("can get all companies with no search query", async function () {
    let query = {};
   
    let c = await Company.getCompanies(query);
   
    expect(c).toEqual(
      [{ handle: "amazon", name: "Amazon" },
      { handle: "apple", name: "Apple" },
      { handle: "rithm", name: "Rithm" }
      ]);
  });
});



afterAll(async function () {
  await db.end();
});
