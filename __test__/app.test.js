const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test_data");
const { seed } = require("../db/seeds/seed");

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("/api", () => {
  describe("GET", () => {
    test("should respond with ok message", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((res) => {
          expect(res.body.msg).toBe("OK");
        });
    });
  });
});

describe("/api/months", () => {
  describe("GET", () => {
    test("should respond with an array of months data", () => {
      return request(app)
        .get("/api/months")
        .expect(200)
        .then((res) => {
          expect(res.body.months).toHaveLength(6);
          res.body.months.forEach((month) => {
            expect(month).toEqual(
              expect.objectContaining({
                month: expect.any(Number),
                days: expect.any(Number),
                steps: expect.any(Number),
              })
            );
          });
        });
    });
  });
  describe("POST", () => {
    test("should add the month to the db", () => {
      return request(app)
        .post("/api/months")
        .send({
          month: 7,
          year: 2021,
          days: 31,
          steps: 150000,
        })
        .expect(201)
        .then((res) => {
          expect(res.body.month).toEqual({
            month: 7,
            year: 2021,
            days: 31,
            steps: 150000,
          });
        });
    });
    test("should return a 400 if request body contains incompatible data", () => {
      return request(app)
        .post("/api/months")
        .send({
          month: "January",
          year: 2021,
          days: 31,
          steps: 150000,
        })
        .expect(400);
    });
    //test 400 for missing data - will require some logic in model and a customer err handler
  });
});
