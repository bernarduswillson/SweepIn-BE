import supertest from "supertest"
import { createServer } from "../utils/server"
import { db } from "../utils/db.server"
import path from "path"

const image1 = path.resolve(__dirname, "test1.png")
const image2 = path.resolve(__dirname, "test2.png")

let userPayload = {
    id: "1",
    name: "ken17",
    email: "ken17@gmail.com",
    role: "SECURITY",
    location: "CIREBON"
}

let reportPayload = {
    id: "1",
    userId: "1",
    status: "WAITING",
    description: "Test",
    images: [image1, image2]
}

beforeAll(async () => {
    const { body } = await supertest(createServer())
        .post("/register")
        .send(userPayload)

    reportPayload.userId = body.data.id
    userPayload.id = body.data.id
})

afterAll(async () => {
    db.report.delete({ where: { id: reportPayload.id } })
    db.user.delete({ where: { id: reportPayload.userId } })
})

describe("Report Service", () => {
    describe("Submit Report", () => {
        describe("given a valid report", () => {
            it("should be able to submit a new report", async () => {
                const { body, statusCode } = await supertest(createServer())
                    .post("/report")
                    .field({
                        user_id: reportPayload.userId,
                        description: reportPayload.description ?? "", // Ensure description is always a string
                        files: reportPayload.images
                    })
                reportPayload.id = body.data.id
                expect(statusCode).toBe(200)
                expect(body.message).toBe("Submit post successful")
            })
        })
        
        describe("given an invalid report", () => {
            it("should not be able to submit a new report", async () => {
                const { body, statusCode } = await supertest(createServer())
                    .post("/report")
                    .field({
                        description: reportPayload.description ?? "",
                        files: reportPayload.images
                    })

                expect(statusCode).toBe(500)
                expect(body.message).toBe("Internal server error")
            })
        })
    })

    describe("Get Report Details", () => {
        describe("given a valid report id", () => {
            it("should be able to retrieve report details", async () => {
                const { body, statusCode } = await supertest(createServer())
                    .get(`/report/${reportPayload.id}`)
                
                expect(statusCode).toBe(200)
                expect(body.message).toBe("Get report details successful")
                expect(body.data).toBeTruthy()
            })
        })

        describe("given an invalid report id", () => {
            it("should not be able to retrieve report details", async () => {
                const invalidID = "09a"
                const { body, statusCode } = await supertest(createServer())
                    .get(`/report/${invalidID}`)
                expect(statusCode).toBe(404)
                expect(body.message).toBe("Report not found")
            })
        })
    })
})

