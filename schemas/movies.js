const z = require('zod')

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Title must be a string',
    required_error: 'Title is required'
  }).min(1).max(100),
  year: z.number().int().min(1888).max(2024),
  genre: z.array(z.string()).min(1).max(10), // genre:z.array(z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Western'])).min(1).max(10),
  duration: z.number().int().min(1).max(500).positive(),
  rate: z.number().int().min(1).max(10).positive().optional()

})

function validateMovieSchema (objects) {
  return movieSchema.safeParse(objects)
}
function validatePartialSchema (objects) {
  return movieSchema.partial().safeParse(objects)
}

module.exports = {
  validateMovieSchema,
  validatePartialSchema
}
