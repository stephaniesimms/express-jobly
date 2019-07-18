const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const Company = require("../../models/company");


describe("Company Routes Test", function () {
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


    /** GET /companies => {companies: [...]}  */

    test("can get list of companies", async function () {
        let response = await request(app)
            .get("/companies/")

        expect(response.body).toEqual(
            {
                companies: [
                    { handle: "amazon", name: "Amazon" },
                    { handle: "apple", name: "Apple" },
                    { handle: "rithm", name: "Rithm" }
                ]
            }

        );
    });

    /** GET /companies?name=Amazon => {companies: [...]}  */

    test("can get list of company matched given name", async function () {
        let response = await request(app)
            .get("/companies/?name=Apple")

        expect(response.body).toEqual(
            { companies: [{ handle: "apple", name: "Apple" }] }

        );
    });

    /** GET /companies?max_employees=10 => {companies: [...]}  */

    test("can get list of companies matched with max number ", async function () {
        let response = await request(app)
            .get("/companies?max_employees=10")

        expect(response.body).toEqual(
            { companies:  [ { handle: "rithm", name: "Rithm" }] }

        );
    });

     /** GET /companies?min_employees=10 => {companies: [...]}  */

    test("can get list of companies with combination of search term ", async function () {
        let response = await request(app)
            .get("/companies?min_employees=3000000&name=Amazon")

        expect(response.body).toEqual(
            { companies:  [ { handle: "amazon", name: "Amazon" } ] }

        );
    });

    /** GET /companies?min_employees=100&max_employees=10 => {companies: [...]}  */

    test("when min is greater than max, it will return error ", async function () {
        let response = await request(app)
            .get("/companies?min_employees=100&max_employees=10")

        expect(response.body).toEqual(
            { "message": "Invalid query",
             "status": 400}

        );
    });

    test("when no companies matched with search ", async function () {
        let response = await request(app)
            .get("/companies?max_employees=1")

        expect(response.body).toEqual(
            { "message": "No matching companies.",
             "status": 404}

        );
    });

    
});


// try {
//     await Company.getBySearch(query)
//   } catch (err) {
//     expect(err.message).toEqual("Invalid query");

//   }








afterAll(async function () {
    await db.end();
});
