import supertest from "supertest"
import { createServer } from "../utils/server"
import path from "path"

const image1 = path.resolve(__dirname, "__image__/image.png")

let userPayload = {
  id: "1",
  name: Math.random().toString(36).substring(7),
  email: Math.random().toString(36).substring(7) + "@example.com",
  role: "SECURITY",
  location: "CIREBON"
}

let logPayload = {
  id: "1",
  userId: "1",
  date: new Date(),
  image: image1,
  latitude: "1",
  longitude: "1"
}

let newAttendance = {
  id: "1"
}

beforeAll(async () => {
  const { body } = await supertest(createServer())
    .post("/register")
    .send(userPayload)

  logPayload.userId = body.data.id
  userPayload.id = body.data.id
})

describe("Attendance and Log Service", () => {
  describe("Create Attendance and Log", () => {
    describe("given an valid log", () => {
      it("shouldbe able to create a new attendance and log", async () => {
        const { body, statusCode } = await supertest(createServer())
          .post("/log")
          .field({
            userId: logPayload.userId,
            date: logPayload.date.toISOString(),
            latitude: logPayload.latitude,
            longitude: logPayload.longitude
          })
          .attach("file", image1)
        logPayload.id = body.data.logId
        expect(statusCode).toBe(200)
        expect(body.message).toBe("Submit log successful")
        newAttendance.id = body.data.attendanceId
      }, 20000)
    })
    describe("given an invalid log", () => {
      it("should not be able to create a new attendance and log", async () => {
        const { body, statusCode } = await supertest(createServer()).post(
          "/log"
        )

        expect(statusCode).toBe(500)
        expect(body.message).toBe("Internal server error")
      })
    })
  })
  describe("Get All Attendance", () => {
    describe("given an valid page and per_page attribute", () => {
      it("should be able to get all attendance", async () => {
        const { body, statusCode } = await supertest(createServer())
          .get("/attendance")
          .query({
            page: "1",
            per_page: "10"
          })
        expect(statusCode).toBe(200)
        expect(body.message).toBe("Get all attendance successful")
      })
    })
    describe("given an invalid page and per_page attribute", () => {
      it("should not be able to get all attendance", async () => {
        const { body, statusCode } = await supertest(createServer()).get(
          "/attendance"
        )
        expect(statusCode).toBe(500)
        expect(body.message).toBe("Internal server error")
      })
    })
  })
  describe("Get Attendance Details", () => {
    describe("given a valid attendance id", () => {
      it("should be able to retrieve attendance details", async () => {
        const { body, statusCode } = await supertest(createServer()).get(
          `/attendance/${newAttendance.id}`
        )

        expect(statusCode).toBe(200)
        expect(body.message).toBe("Get attendance details successful")
      })
    })
    describe("given an invalid attendance id", () => {
      it("should not be able to retrieve attendance details", async () => {
        const invalidId = "invalidId"
        const { body, statusCode } = await supertest(createServer()).get(
          `/attendance/invalidId`
        )
        expect(statusCode).toBe(404)
        expect(body.message).toBe("Attendance not found")
      })
    })
  })
})
