const {Company} = require("../../models/company")

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
      num_employees: 10000,
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
    
    let c = await Company.getAll();

    expect(c).toEqual(
      [{ handle: "amazon", name: "Amazon" },
      { handle: "apple", name: "Apple" },
      { handle: "rithm", name: "Rithm" }
      ]);
  });

  test("can get companies with search query is name", async function () {
    let query = { name: 'Amazon' };
    let c = await Company.getBySearch(query);

    expect(c).toEqual(
      [{ handle: "amazon", name: "Amazon" }]);
  });

  test("can get companies with search query is max", async function () {
    let query = { max_employees: '20000' };
    let c = await Company.getBySearch(query);

    expect(c).toEqual(
      [{ handle: "apple", name: "Apple" },
      { handle: "rithm", name: "Rithm" }]);
  });

  test("can get companies with search query is max and min", async function () {
    let query = { max_employees: 20000, min_employees: 10 };
    let c = await Company.getBySearch(query);

    expect(c).toEqual(
      [{ handle: "apple", name: "Apple" }]);
  });

  test("Will get error message if there is no match 1", async function () {
    let query = { max_employees: 1 };

    try {
      await Company.getBySearch(query);
    } catch (err) {
      expect(err.message).toEqual("No matching companies.");
    }
  });


  test("Will get error message if max is smaller than min", async function () {
    let query = { max_employees: 1, min_employees: 100 };
    try {
      await Company.getBySearch(query)
    } catch (err) {
      expect(err.message).toEqual("Invalid query");

    }
  });
});



afterAll(async function () {
  await db.end();
});
