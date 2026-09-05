import type { Response } from 'express'

export const success = <T>(response: Response, data: T, status = 200, meta?: Record<string, unknown>) => {
  return response.status(status).json({ success: true, data, ...(meta ? { meta } : {}) })
}

export const noContent = (response: Response) => response.status(204).send()
