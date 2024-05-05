import supertest from 'supertest'
import { createServer } from '../utils/server'
import { db } from '../utils/db'
import path from 'path'
import { Report, User } from '@prisma/client'

const image1 = path.resolve(__dirname, 'test1.png')
const image2 = path.resolve(__dirname, 'test2.png')

const userPayload: User = {
  id: 1,
  name: 'reportTest',
  email: 'reportTest@test.com',
  status: 'ACTIVE',
  role: 'SECURITY',
  location: 'CIREBON'
}

const imagePayload = [image1, image2]

const reportPayload: Report = {
  id: 1,
  userId: 1,
  date: new Date(),
  status: 'WAITING',
  description: 'Test'
}

beforeAll(async () => {
  const { body } = await supertest(createServer())
    .post('/register')
    .send(userPayload)

  reportPayload.userId = body.data.id
  userPayload.id = body.data.id
})

afterAll(async () => {
  await db.user.delete({ where: { id: userPayload.id } })
})

describe('Report Service', () => {
  describe('Submit Report', () => {
    describe('given a valid report', () => {
      it('should be able to submit a new report', async () => {
        const { body, statusCode } = await supertest(createServer())
          .post('/report')
          .field({
            user_id: reportPayload.userId,
            description: reportPayload.description ?? '',
            files: imagePayload
          })
        reportPayload.id = body.data.id
        reportPayload.date = body.data.date
        expect(statusCode).toBe(200)
        expect(body.message).toBe('Report submitted successful')
        expect(body.data).toEqual(reportPayload)
      })
    })

    describe('given an unexisting user', () => {
      it('should not be able to submit a new report', async () => {
        const { body, statusCode } = await supertest(createServer())
          .post('/report')
          .field({
            user_id: 0,
            description: reportPayload.description ?? '',
            files: imagePayload
          })

        expect(statusCode).toBe(404)
        expect(body.message).toBe('User not found')
      })
    })
  })

  describe('Get Report Details', () => {
    describe('given a valid report id', () => {
      it('should be able to retrieve report details', async () => {
        const { body, statusCode } = await supertest(createServer()).get(
          `/report/${reportPayload.id}`
        )

        expect(statusCode).toBe(200)
        expect(body.message).toBe('Get report details successful')
        expect(body.data).toStrictEqual({
          id: reportPayload.id,
          date: reportPayload.date,
          status: reportPayload.status,
          description: reportPayload.description,
          user: {
            id: userPayload.id,
            name: userPayload.name
          },
          images: []
        })
      })
    })

    describe('given an unexisting report id', () => {
      it('should not be able to retrieve report details', async () => {
        const invalidID = '0'
        const { body, statusCode } = await supertest(createServer()).get(
          `/report/${invalidID}`
        )
        expect(statusCode).toBe(404)
        expect(body.message).toBe('Report not found')
      })
    })
  })
})
