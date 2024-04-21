import type { Response } from "express"

class UnauthorizedError extends Error {
  code: number = 401

  constructor(message: string) {
    super(message)
    this.name = "UnauthorizedError"
  }
}

class NotFoundError extends Error {
  code: number = 404

  constructor(message: string) {
    super(message)
    this.name = "NotFoundError"
  }
}

class InvalidAttributeError extends Error {
  code: number = 400

  constructor(message: string) {
    super(message)
    this.name = "InvalidAttributeError"
  }
}

const responseError = (e: any, res: Response) => {
  if (
    e instanceof UnauthorizedError ||
    e instanceof NotFoundError ||
    e instanceof InvalidAttributeError
  ) {
    return res.status(e.code).json({
      message: e.message
    })
  }
  console.error(e)
  return res.status(500).json({
    message: e.message
  })
}

export {
  UnauthorizedError,
  NotFoundError,
  InvalidAttributeError,
  responseError
}
