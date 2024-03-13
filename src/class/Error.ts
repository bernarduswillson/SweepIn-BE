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

const responseError = (e: any, res: Response) => {
  if (e instanceof UnauthorizedError || e instanceof NotFoundError) {
    return res.status(e.code).json({
      message: e.message
    })
  }
  console.error(e)
  return res.status(500).json({
    message: "Internal server error"
  })
}

export { UnauthorizedError, NotFoundError, responseError }
