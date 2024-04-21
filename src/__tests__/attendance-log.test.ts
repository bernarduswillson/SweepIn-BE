import supertest from 'supertest'
import { createServer } from '../utils/server'
import path from 'path'
import { Attendance, Log, User } from '@prisma/client'
import { db } from '../utils/db'

const image1 = path.resolve(__dirname, '__image__/image.png')

const userPayload: User = {
  id: 1,
  name: 'logTest',
  email: 'logTest@test.com',
  role: 'SECURITY',
  location: 'GANESHA'
}

const logPayload: Log = {
  id: 1,
  date: new Date(),
  latitude: 1,
  longitude: 1,
  attendanceStartId: null,
  attendanceEndId: null
}

const attendancePayload: Attendance = {
  id: 1,
  date: new Date(),
  userId: 1
}

beforeAll(async () => {
  const { body } = await supertest(createServer())
    .post('/register')
    .send(userPayload)

  userPayload.id = body.data.id
  attendancePayload.userId = body.data.id
})

afterAll(async () => {
  await db.user.delete({ where: { id: userPayload.id } })
})

describe('Attendance and Log Service', () => {
  describe('Create Start Attendance Log', () => {
    describe('given a valid start attendance log', () => {
      it('should be able to create a new start attendance log', async () => {
        const { body, statusCode } = await supertest(createServer())
          .post('/log')
          .field({
            userId: userPayload.id,
            date: logPayload.date.toISOString(),
            latitude: logPayload.latitude,
            longitude: logPayload.longitude
          })
          .attach('file', image1)

        logPayload.id = body.data.logId
        logPayload.attendanceStartId = body.data.attendanceId
        attendancePayload.id = body.data.attendanceId

        expect(statusCode).toBe(200)
        expect(body.message).toBe('Submit log successful')
      }, 20000)
    })
    describe('given an inexistent user id', () => {
      it('should not be able to create a new start attendance log', async () => {
        const { body, statusCode } = await supertest(createServer())
          .post('/log')
          .field({
            userId: 0,
            date: logPayload.date.toISOString(),
            latitude: logPayload.latitude,
            longitude: logPayload.longitude
          })
          .attach('file', image1)
        
        expect(statusCode).toBe(404)
        expect(body.message).toBe('User not found')
      })
    })
  })
  describe('Create End Attendance Log', () => {
    describe('given a valid end attendance log', () => {
      it('should be able to create a new end attendance log', async () => {
        const { body, statusCode } = await supertest(createServer())
          .post('/log')
          .field({
            userId: userPayload.id,
            attendanceId: attendancePayload.id,
            date: logPayload.date.toISOString(),
            latitude: logPayload.latitude,
            longitude: logPayload.longitude
          })
          .attach('file', image1)

        logPayload.id = body.data.logId
        logPayload.attendanceEndId = body.data.attendanceId

        expect(statusCode).toBe(200)
        expect(body.message).toBe('Submit log successful')
        expect(body.data.attendanceId).toBe(attendancePayload.id)
      }, 20000)
    })
    describe('given an inexistent start attendance log id', () => {
      it('should not be able to create a new end attendance log', async () => {
        const { body, statusCode } = await supertest(createServer())
          .post('/log')
          .field({
            userId: userPayload.id,
            attendanceId: 0,
            date: logPayload.date.toISOString(),
            latitude: logPayload.latitude,
            longitude: logPayload.longitude
          })
          .attach('file', image1)

        expect(statusCode).toBe(500)
        expect(body.message).toBe('Attendance does not exist')
      })
    })
    describe('given an inexistent user id', () => {
      it('should not be able to create a new start attendance log', async () => {
        const { body, statusCode } = await supertest(createServer())
          .post('/log')
          .field({
            userId: 0,
            date: logPayload.date.toISOString(),
            latitude: logPayload.latitude,
            longitude: logPayload.longitude
          })
          .attach('file', image1)
        
        expect(statusCode).toBe(404)
        expect(body.message).toBe('User not found')
      })
    })
    describe('given an attendance that has already ended', () => {
      it('should not be able to create a new end attendance log', async () => {
        const { body, statusCode } = await supertest(createServer())
          .post('/log')
          .field({
            userId: userPayload.id,
            attendanceId: attendancePayload.id,
            date: logPayload.date.toISOString(),
            latitude: logPayload.latitude,
            longitude: logPayload.longitude
          })
          .attach('file', image1)

        expect(statusCode).toBe(500)
        expect(body.message).toBe('Attendance already ended')
      })
    })
  })
  describe('Get All Attendance', () => {
    describe('given a valid page and per_page attribute', () => {
      it('should be able to get all attendance', async () => {
        const { body, statusCode } = await supertest(createServer())
          .get('/attendance')
          .query({
            page: '1',
            per_page: '10'
          })
        expect(statusCode).toBe(200)
        expect(body.message).toBe('Get all attendance successful')
      })
    })
    describe('given an inexistent user id', () => {
      it('should not be able to get all attendance', async () => {
        const { body, statusCode } = await supertest(createServer())
          .get('/attendance')
          .query({
            user_id: '0',
            page: '1',
            per_page: '10'
          })
        expect(statusCode).toBe(404)
        expect(body.message).toBe('Attendance not found')
      })
    })
  })
  describe('Get Attendance Details', () => {
    describe('given a valid attendance id', () => {
      it('should be able to retrieve attendance details', async () => {
        const { body, statusCode } = await supertest(createServer()).get(
          `/attendance/${attendancePayload.id}`
        )

        expect(statusCode).toBe(200)
        expect(body.message).toBe('Get attendance details successful')
      })
    })
    describe('given an invalid attendance id', () => {
      it('should not be able to retrieve attendance details', async () => {
        const invalidId = '0'
        const { body, statusCode } = await supertest(createServer()).get(
          `/attendance/${invalidId}`
        )
        expect(statusCode).toBe(404)
        expect(body.message).toBe('Attendance not found')
      })
    })
  })
})
