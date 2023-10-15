import cors from 'cors'
const whitelist = ['http://localhost:3000', 'http://localhost:8080', 'http://movies.com']
export const corsMiddleware = (options = whitelist) => cors({
  origin: (origin, callback) => {
    if (options.includes(origin)) {
      return callback(null, true)
    }
    if (!origin) {
      return callback(null, true)
    }
    callback(new Error('Not allowed by CORS'))
  }
})
