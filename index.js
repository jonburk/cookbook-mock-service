'use strict'

var app = require('express')()
var cors = require('cors')
var serverPort = 8080
var mock = require('./mock').create()
var faker = require('faker')

app.use(cors({ exposedHeaders: 'X-Total-Count' }))

app.get('/api/recipes/:id', function (req, res) {
  const result = mock.recipes.find(function (recipe) {
    return recipe.id === req.params.id
  })

  if (result === undefined) {
    return res.sendStatus(404)
  } else {
    return res.send(result)
  }
})

app.get('/api/recipes', function (req, res) {
  const offset = parseInt(req.query.offset || 0)
  const limit = req.query.limit

  console.log('Recipe search terms = ' + req.query.search + ' offset = ' + offset + ' limit = ' + limit)

  let result = mock.recipes

  // Filter results
  if (req.query.search !== undefined) {
    [].concat(req.query.search).forEach(function (term) {
      switch (term.toLowerCase()) {
        case 'vegan':
          result = result.filter(function (recipe) { return recipe.ingredients.filter(function (ingredient) { return !ingredient.meat && !ingredient.dairy }).length > 0 })
          break
        case 'vegetarian':
          result = result.filter(function (recipe) { return recipe.ingredients.filter(function (ingredient) { return !ingredient.meat }).length > 0 })
          break
        case 'in season':
          result = result.filter(function (recipe) { return recipe.tags.filter(function (tag) { return tag.name === 'winter' }).length > 0 })
          break
        case '-warn':
          result = result.filter(function (recipe) { return recipe.ingredients.filter(function (ingredient) { return !ingredient.warn }).length > 0 })
          break
        default:
          result = result.filter(function (recipe) {
            const terms = recipe.title.toLowerCase().split(' ')
              .concat(recipe.ingredients.map(function (ingredient) { return ingredient.name.toLowerCase() }))
              .concat(recipe.tags.map(function (tag) { return tag.name.toLowerCase() }))

            return terms.indexOf(term.toLowerCase()) >= 0
          })
      }
    })
  }

  res.setHeader('X-Total-Count', result.length)

  result = result.slice(offset, limit ? parseInt(limit) + offset : mock.recipes.length - 1)
  res.send(result)
})

app.get('/api/recipes/search-terms', function (req, res) {
  let result = mock.terms

  if (req.query.startsWith) {
    result = result.filter(function (term) {
      return term.startsWith(req.query.startsWith)
    })
  }

  res.send(result)
})

app.get('/api/recipes/:id/thumbnail', function (req, res) {
  res.redirect(faker.image.food())
})

app.get('/api/recipes/:id/image', function (req, res) {
  res.redirect(faker.image.food())
})

// Start the server
app.listen(serverPort, function () {
  console.log(`Mock cookbook service ready on port ${serverPort}`)
})
