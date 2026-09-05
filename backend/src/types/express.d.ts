declare global {
  namespace Express {
    interface Request {
      auth?: {
        adminId: string
        sessionId: string
        email: string
        name: string
      }
    }
  }
}

export {}
