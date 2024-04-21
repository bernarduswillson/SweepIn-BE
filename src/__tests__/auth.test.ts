import { User } from '@prisma/client'
import supertest from 'supertest'
import { createServer } from '../utils/server'

const userPayload: User = {
  id: 1,
  name: 'authTest',
  email: 'authtest@test.com',
  role: 'SECURITY',
  location: 'GANESHA'
}

describe('Auth Service', () => {
  describe('Registration', () => {
    describe('given a valid user', () => {
      it('should be able to create a new user', async () => {
        const { body, statusCode } = await supertest(createServer())
          .post('/register')
          .send(userPayload)

        userPayload.id = body.data.id
        expect(statusCode).toBe(201)
        expect(body.message).toBe('User created')
        expect(body.data).toEqual(userPayload)
      })
    })
    describe('given an existing user', () => {
      it('should not be able to create a new user', async () => {
        const { body, statusCode } = await supertest(createServer())
          .post('/register')
          .send(userPayload)

        expect(statusCode).toBe(500)
        expect(body.message).toBe('User already exists')
      })
    })
    describe('given an invalid role', () => {
      it('should not be able to create a new user', async () => {
        const { body, statusCode } = await supertest(createServer())
          .post('/register')
          .send({ ...userPayload, role: 'INVALID' })

        expect(statusCode).toBe(400)
        expect(body.message).toBe('Invalid role')
      })
    })
    describe('given an invalid location', () => {
      it('should not be able to create a new user', async () => {
        const { body, statusCode } = await supertest(createServer())
          .post('/register')
          .send({ ...userPayload, location: 'INVALID' })

        expect(statusCode).toBe(400)
        expect(body.message).toBe('Invalid location')
      })
    })
  })

  describe('Login', () => {
    describe('given an unregistered user', () => {
      it('should be able to verify unregistered user by email', async () => {
        const { body, statusCode } = await supertest(createServer())
          .post('/login')
          .send({ email: 'unverified@email.com' })

        expect(statusCode).toBe(401)
        expect(body.message).toBe('Email is not registered')
      })
    })

    describe('given a registered user', () => {
      it('should be able to verify user by email', async () => {
        const { body, statusCode } = await supertest(createServer())
          .post('/login')
          .send({ email: userPayload.email })

        expect(statusCode).toBe(200)
        expect(body.message).toBe('Login successful')
        expect(body.data).toEqual(userPayload)
      })
    })
  })

  describe('Delete User', () => {
    describe('given a valid user id', () => {
      it('should be able to delete a user', async () => {
        const { body, statusCode } = await supertest(createServer()).delete(
          `/user/${userPayload.id}`
        )

        expect(statusCode).toBe(200)
        expect(body.message).toBe('User deleted')
        expect(body.data).toEqual(userPayload)
      })
    })

    describe('given an invalid user id', () => {
      it('should not be able to delete a user', async () => {
        const { body, statusCode } = await supertest(createServer()).delete(
          `/user/${userPayload.id}`
        )

        expect(statusCode).toBe(500)
        expect(body.message).toBe('User not found')
      })
    })
  })
})
