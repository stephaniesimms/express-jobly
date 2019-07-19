const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const { Job } = require("../../models/job");
const { Company} = require("../../models/company")

const JOB_ID;

describe("Job Route tests", function () {
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
            Salary: 90000,
            equity: 0.01,
            company_handle: "amazon",

        });

        let j2 = await Job.create({
            title: "Senior Backend Developer",
            Salary: 190000,
            equity: 0.05,
            company_handle: "amazon",
        });
        
        let j3 = await Job.create({
            title: "Fullstack Developer",
            Salary: 300000,
            equity: 0.07,
            company_handle: "apple",
        });

        let j4 = await Job.create({
            title: "Administrative assistant",
            Salary: 70000,
            equity: 0.001,
            company_handle: "apple",
        });
        JOB_ID = j2.id
    });
    
  });

  describe("GET/jobs", function () {
    /** GET /jobs => {companies: [...]}  */
    test("can get list of jobs", async function () {
      let response = await request(app)
        .get("/jobs")

      expect(response.body).toEqual({
          jobs: [
            { title: "Junior Backend Developer", company_handle: "amazon" },
            { title: "Senior Backend Developer", company_handle: "amazon" },
            { title: "Fullstack Developer", company_handle: "apple" },
            { title: "Administrative assistant", company_handle: "apple" }
            ]});
    });

    test("can get single job by id ", async function () {
      let response = await request(app)
        .get(`/jobs/${JOB_ID}`)

      expect(response.body).toEqual({
        job: {
            title: "Senior Backend Developer",
            Salary: 190000,
            equity: 0.05,
            company_handle: "amazon", 
            date_posted: expect.any(Date)
        }
      });
    });

    test("get single job by id returns error if it does not exist", async function () {
      let response = await request(app)
        .get("/jobs/a")

      expect(response.body).toEqual({
        "message": "No company found.",
        "status": 404
      });
    });

   
    test("can get list of job matched given title", async function () {
      let response = await request(app)
        .get("/jobs?title=administrative+assistant")

      expect(response.body).toEqual(
       { job: {
            title: "Administrative Assistant",
            Salary: 70000,
            equity: 0.001,
            company_handle: "Amazon", 
            date_posted: expect.any(Date)
        }
        });
    });


    
/******************************************************************************* */
    /** GET /companies?max_employees=10 => {companies: [...]}  */
    test("can get list of companies matched with max number ", async function () {
      let response = await request(app)
        .get("/companies?max_employees=10")

      expect(response.body).toEqual(
        { companies: [{ handle: "rithm", name: "Rithm" }] }

      );
    });

    /** GET /companies?min_employees=10 => {companies: [...]}  */
    test("can get list of companies with combination of search term ", async function () {
      let response = await request(app)
        .get("/companies?min_employees=3000000&name=Amazon");

      expect(response.body).toEqual(
        { companies: [{ handle: "amazon", name: "Amazon" }] }
      );
    });

    /** GET /companies?min_employees=100&max_employees=10 => {companies: [...]}  */
    test("when min is greater than max, it will return error ", async function () {
      let response = await request(app)
        .get("/companies?min_employees=100&max_employees=10")

      expect(response.body).toEqual({
          "message": "Invalid query",
          "status": 400
        });
    });

    test("when no companies matched with search ", async function () {
      let response = await request(app)
        .get("/companies?max_employees=1")

      expect(response.body).toEqual({
        "message": "No matching companies.",
        "status": 404
      });
    });
  });


  describe("POST new company", function () {
    test("Can create a company", async function () {
      let response = await request(app)
        .post("/companies")
        .send({
          handle: "zillow",
          name: "Zillow",
          num_employees: 100000,
          description: "Real Estate solution",
          logo_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWYikqi0wGu6e_BLcEcDtINNitmXY_8aKKUsokN3dCeZ3gCF8o"
        })

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        company: {
          handle: "zillow",
          name: "Zillow",
          num_employees: 100000,
          description: "Real Estate solution",
          logo_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWYikqi0wGu6e_BLcEcDtINNitmXY_8aKKUsokN3dCeZ3gCF8o"
        }
      });
    });

    test("send invalid data missing name should return error", async function () {
      let response = await request(app)
        .post("/companies")
        .send({
          handle: "zillow",
          num_employees: 100000,
          description: "Real Estate solution",
          logo_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWYikqi0wGu6e_BLcEcDtINNitmXY_8aKKUsokN3dCeZ3gCF8o"
        })

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toEqual(
        ["instance requires property \"name\""]
      );
    });

    test("try create duplicate company should return error", async function () {
      let response = await request(app)
        .post("/companies")
        .send({
          handle: "amazon",
          name: "Amazon",
          num_employees: 3000000,
          description: "Online market place and AWS",
          logo_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWYikqi0wGu6e_BLcEcDtINNitmXY_8aKKUsokN3dCeZ3gCF8o"
        });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        "message": "Company already exists",
        "status": 400
      });
    });


    describe("PATCH/companies/:handle", function () {
      test("Can update a company", async function () {
        let response = await request(app)
          .patch("/companies/amazon")
          .send({
            handle: "amazon",
            name: "AmazonUpdate",
            num_employees: 100000,
            description: "Online market place and AWS",
            logo_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWYikqi0wGu6e_BLcEcDtINNitmXY_8aKKUsokN3dCeZ3gCF8o"
          })

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
          company: {
            handle: "amazon",
            name: "AmazonUpdate",
            num_employees: 100000,
            description: "Online market place and AWS",
            logo_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWYikqi0wGu6e_BLcEcDtINNitmXY_8aKKUsokN3dCeZ3gCF8o"
          }
        });
      });

      test("send invalid number of employee to update should return error", async function () {
        let response = await request(app)
          .patch("/companies/amazon")
          .send({
            handle: "amazon",
            name: "Amazon",
            num_employees: 0,
          })

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          ["instance.num_employees must have a minimum value of 1"]
        );
      });

      test("try update company that does not exist should return error", async function () {
        let response = await request(app)
          .patch("/companies/zillow")
          .send({
            handle: "zillow",
            name: "Zillow",
            num_employees: 100000,
            description: "Real Estate solution",
            logo_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWYikqi0wGu6e_BLcEcDtINNitmXY_8aKKUsokN3dCeZ3gCF8o"
          });
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
          "message": "No companies found",
          "status": 404
        });
      });
    });


    describe("DELETE/companies/:handle", function () {
      test("Can delete a company", async function () {
        let response = await request(app)
          .delete("/companies/amazon")
          .send({
            handle: "amazon",
          })

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
          "message": "Company deleted"
        });
      });

      test("try delete company that does not exist should return error", async function () {
        let response = await request(app)
          .delete("/companies/zillow")
          .send({
            handle: "zillow",
          });
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
          "message": "No companies with the handle",
          "status": 404
        });
      });
    });
  });

  afterAll(async function () {
    await db.end();
  });
});


