const express = require('express')// --> require -->commonJS
const movies = require('./movies.json')
const crypto = require('crypto')
const validateMovieSchema = require('./movies')
const cors = require('cors')

const app = express()
app.disable('x-powered-by')
app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    const whitelist = ['http://localhost:3000', 'http://localhost:8080']
    if (whitelist.includes(origin)) {
      return callback(null, true)
    }
    if (!origin) {
      return callback(null, true)
    }
    callback(new Error('Not allowed by CORS'))
  }
}))

app.get('/movies', (request, response) => {
  response.json(movies)
})

app.get('/movies/:id', (request, response) => {
  const id = request.params.id
  const movie = movies.find((movie) => movie.id === id)
  if (!movie) {
    response.status(404).json({ message: 'Movie not found' })
  }
  response.json(movie)
})

app.get('/movies/search/', (request, response) => {
  const { genre } = request.query
  if (!genre) {
    response.status(400).json({ message: 'Missing genre' })
  }

  const filteredMovies = movies.filter((movie) => {
    movie.genre.some((g) => g.toLocaleLowerCase() === genre.toLowerCase())
    return response.json(filteredMovies)
  })
  response.json(movies)
})
app.post('/movies', (request, response) => {
  const result = validateMovieSchema(request.body)
  if (result.error) { // if(!result.success)
    // puedes usar el 422
    response.status(400).json({ error: JSON.parse(result.error.message) })
  }
  const newMovie = { id: crypto.randomUUID(), ...result.data }
  movies.push(newMovie)
  response.status(201).json(newMovie)
})

app.patch('/movies/:id', (request, response) => {
  const result = validateMovieSchema(request.body)

  if (!result.success) {
    return response.status(404).json({ message: 'Movie not found' })
  }
  const { id } = request.params
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) {
    return response.status(404).json({ message: 'Movie not found' })
  }
  const updatedMovie = { ...movies[movieIndex], ...result.data }

  movies[movieIndex] = updatedMovie
  return response.status(201).json(updatedMovie)
})

app.delete('/movies/:id', (request, response) => {
  const { id } = request.params
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) {
    return response.status(404).json({ message: 'Movie not found' })
  }
  movies.splice(movieIndex, 1)
  return response.status(204).end()
})

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})
