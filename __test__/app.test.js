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
    test("200: should respond with an array of months data", () => {
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
    test("200: should be sortable by date defaulting to descending", () => {
      return request(app)
        .get("/api/months")
        .expect(200)
        .then((res) => {
          expect(res.body.months[5]).toEqual({
            month_id: 5,
            month: 5,
            year: 2021,
            days: 31,
            steps: 200000,
          });
        });
    });
    test("200: should be sortable by date with an ascending query", () => {
      return request(app)
        .get("/api/months?order=asc")
        .expect(200)
        .then((res) => {
          expect(res.body.months[5]).toEqual({
            month_id: 6,
            month: 6,
            year: 2022,
            days: 30,
            steps: 200000,
          });
        });
    });
    test("200: should be sortable by steps", () => {
      return request(app)
        .get("/api/months?sort_by=steps")
        .expect(200)
        .then((res) => {
          expect(res.body.months).toBeSortedBy("steps", { descending: true });
        });
    });
    test("200: should be sortable by steps and ordered by order query", () => {
      return request(app)
        .get("/api/months?sort_by=steps&order=asc")
        .expect(200)
        .then((res) => {
          expect(res.body.months).toBeSortedBy("steps", { descending: false });
        });
    });
    test("200: should be able to filter by year", () => {
      return request(app)
        .get("/api/months?year=2022")
        .expect(200)
        .then((res) => {
          expect(res.body.months).toHaveLength(1);
        });
    });
    test("200: should be able to filter by month", () => {
      return request(app)
        .get("/api/months?month=1")
        .expect(200)
        .then((res) => {
          expect(res.body.months).toHaveLength(1);
        });
    });
    test("200: should be able to filter and sort by steps", () => {
      return request(app)
        .get("/api/months?year=2021&sort_by=steps")
        .expect(200)
        .then((res) => {
          expect(res.body.months).toBeSortedBy("steps", { descending: true });
        });
    });
    test("200: should be able to filter, sort by steps and order", () => {
      return request(app)
        .get("/api/months?year=2021&sort_by=steps&order=asc")
        .expect(200)
        .then((res) => {
          expect(res.body.months).toBeSortedBy("steps", { descending: false });
        });
    });
    describe("errors", () => {
      test("400: should respond with error if order is not valid", () => {
        return request(app)
          .get("/api/months?order=banana")
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("Bad request: order");
          });
      });
      test("400: should respond with error if month is not valid", () => {
        return request(app)
          .get("/api/months?month=banana")
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("Bad request: month");
          });
      });
      test("400: should respond with error if month is out of range", () => {
        return request(app)
          .get("/api/months?month=13")
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("Bad request: month");
          });
      });
      test("400: should respond with error if year is not valid", () => {
        return request(app)
          .get("/api/months?year=banana")
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("Bad request: year");
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
            month_id: 7,
            month: 7,
            year: 2021,
            days: 31,
            steps: 150000,
          });
        });
    });

    describe("errors", () => {
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
      test("should return a 400 if request body is missing a field", () => {
        return request(app)
          .post("/api/months")
          .send({
            year: 2021,
            days: 31,
            steps: 150000,
          })
          .expect(400);
      });
    });
  });
});
