import { MovieModel } from '../models/movie.js'
import { validateMovieSchema, validatePartialSchema } from '../schemas/movies.js'

export class MovieController {
  static async getAll (request, response) {
    const { genre } = request.query
    const movies = await MovieModel.getAll({ genre })
    response.json(movies)
  }

  static async getById (request, response) {
    const id = request.params.id
    const movie = await MovieModel.getById({ id })
    if (movie) {
      return response.json(movie)
    }
    response.status(404).json({ message: 'Movie not found' })
  }

  static async create (request, response) {
    const result = validateMovieSchema(request.body)
    if (!result.success) {
      return response.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newMovie = await MovieModel.create({ input: result.data })
    response.status(201).json(newMovie)
  }

  static async delete (request, response) {
    const { id } = request.params
    const result = await MovieModel.delete({ id })
    if (result) {
      return response.status(204).json({ message: 'Movie deleted' })
    }
    response.status(404).json({ message: 'Movie not found' })
  }

  static async update (request, response) {
    const result = validatePartialSchema(request.body)
    if (!result.success) {
      return response.status(404).json({ error: JSON.parse(result.error.message) })
    }
    const { id } = request.params
    const updateMovie = await MovieModel.update({ id, input: result.data })
    return response.status(201).json(updateMovie)
  }
}
