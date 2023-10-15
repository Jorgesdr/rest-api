import express, { json } from 'express'

import { moviesRouter } from './routes/movies'

import { corsMiddleware } from './middlewares/cors'
// import fs from 'node:fs'

// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))
// leer JSON ESmodulecreando require

const app = express()
app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by')

app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})
