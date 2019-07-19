const { Company } = require("../../models/company")
const { Job } = require("../../models/job")

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

        let j1 = await Job.create({
            title: "Junior Backend Developer",
            salary: 90000,
            equity: 0.01,
            company_handle: "amazon",

        });

        let j2 = await Job.create({
            title: "Senior Backend Developer",
            salary: 190000,
            equity: 0.05,
            company_handle: "amazon",
        });

        let j3 = await Job.create({
            title: "Fullstack Developer",
            salary: 300000,
            equity: 0.07,
            company_handle: "apple",
        });

        let j4 = await Job.create({
            title: "Administrative assistant",
            salary: 70000,
            equity: 0.001,
            company_handle: "apple",
        });
    });



    test("can get all jobs with no search query", async function () {

        let c = await Job.getAll();

        expect(c).toEqual(
            [{ title: "Junior Backend Developer", company_handle: "amazon" },
            { title: "Senior Backend Developer", company_handle: "amazon" },
            { title: "Fullstack Developer", company_handle: "apple" },
            { title: "Administrative assistant", company_handle: "apple" },
            ]);
    });

    test("can get companies with search query is title ", async function () {
        let query = { title: 'Junior Backend Developer' };
        let c = await Job.getBySearch(query);

        expect(c).toEqual(
            [{ title: "Junior Backend Developer", company_handle: "amazon" }]);
    });

    test("can get companies with search query is company ", async function () {
        let query = { company_handle: 'apple' };
        let c = await Job.getBySearch(query);

        expect(c).toEqual(
            [{ title: "Junior Backend Developer", company_handle: "amazon" },
            { title: "Backend Backend Developer", company_handle: "amazon" }]);
    });

    test("can get title with search query is min_salary", async function () {
        let query = { min_salary: 200000 };
        let c = await Job.getBySearch(query);

        expect(c).toEqual(
            [{ title: "Fullstack Developer", company_handle: "apple" }]);
    });

    test("can get companies with search query is min equity", async function () {
        let query = { min_equity: 0.04 };
        let c = await Job.getBySearch(query);

        expect(c).toEqual(
            [{ title: "Fullstack Developer", company_handle: "apple" },
            { title: "Senior Backend Developer", company_handle: "amazon" }]);
    });

    test("can get companies with search query is min_salary and company_hanlde", async function () {
        let query = { min_salary: 200000,  company_handle: 'apple'  };
        let c = await Job.getBySearch(query);

        expect(c).toEqual(
            [{ title: "Fullstack Developer", company_handle: "apple" }]);
    });
    
    test("Will get error message if there is no match 1", async function () {
        let query = { max_employees: 1 };

        try {
            await Job.getBySearch(query);
        } catch (err) {
            expect(err.message).toEqual("No matching companies.");
        }
    });

});



afterAll(async function () {
    await db.end();
});
