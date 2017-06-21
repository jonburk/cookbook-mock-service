const faker = require('faker')
const guid = require('guid')
const _ = require('lodash')

function create () {
  const mock = {
    books: [],
    recipes: []
  }

  // Tags
  const seasons = [
    'summer', 'winter', 'spring', 'fall'
  ].map(function (name) {
    return {
      id: guid.raw(),
      name: name
    }
  })

  const meals = [
    'breakfast', 'lunch', 'dinner', 'dessert'
  ].map(function (name) {
    return {
      id: guid.raw(),
      name: name
    }
  })

  mock.tags = seasons.concat(meals)

  // Ingredients
  const staples = [
    'Flour', 'Sugar', 'Oil', 'Salt', 'Pepper', 'Vinegar'
  ].map(function (name) {
    return {
      id: guid.raw(),
      name: name,
      staple: true
    }
  })

  const dairy = [
    'Milk', 'Butter', 'Eggs', 'Cheese'
  ].map(function (name) {
    return {
      id: guid.raw(),
      name: name,
      dairy: true
    }
  })

  const vegetables = [
    'Carrots', 'Leeks', 'Potatoes', 'Onions', 'Peppers', 'Mushrooms'
  ].map(function (name) {
    return {
      id: guid.raw(),
      name: name
    }
  })

  const meats = [
    'Beef', 'Chicken', 'Pork', 'Lamb'
  ].map(function (name) {
    return {
      id: guid.raw(),
      name: name,
      meat: true
    }
  })

  mock.ingredients = staples.concat(dairy, vegetables, meats)
  mock.ingredients.forEach(function (ingredient) {
    ingredient.warn = faker.random.number({min: 1, max: 5}) === 1
  })

  // Books
  for (let i = 0; i < 20; i++) {
    mock.books.push({
      id: guid.raw(),
      title: faker.commerce.productName(),
      notes: faker.lorem.sentence()
    })
  }

  // Recipes
  const mainIngredients = meats.concat(vegetables)

  const methods = [
    'Grilled', 'Roast', 'Poached', 'Fried', 'Pan Seared', 'Braised'
  ]

  const dishTypes = [
    'Pasta', 'Risotto', 'Pizza', 'Caserole'
  ]

  for (let i = 0; i < 500; i++) {
    const primary = faker.random.arrayElement(mainIngredients)
    let secondary

    do {
      secondary = faker.random.arrayElement(mainIngredients)
    } while (secondary.name === primary.name)

    let ingredients = [primary, secondary]

    for (let i = 0; i < faker.random.number({min: 3, max: 10}); i++) {
      ingredients.push(faker.random.arrayElement(mock.ingredients))
    }

    let primaryName = primary.name
    if (primaryName.endsWith('es')) {
      primaryName = primaryName.substring(0, primaryName.length - 2)
    } else if (primaryName.endsWith('s')) {
      primaryName = primaryName.substring(0, primaryName.length - 1)
    }

    mock.recipes.push({
      id: guid.raw(),
      title: faker.random.arrayElement(methods) + ' ' + primaryName + ' ' + faker.random.arrayElement(dishTypes) + ' with ' + secondary.name,
      page: faker.random.number({min: 1, max: 100}),
      notes: faker.lorem.sentence(),
      favorite: faker.random.number({min: 1, max: 5}) === 1,
      book: faker.random.arrayElement(mock.books),
      ingredients: _.uniqBy(ingredients, 'name'),
      tags: [faker.random.arrayElement(meals), faker.random.arrayElement(seasons)]
    })
  }

  // Search Terms
  mock.terms = mock.tags.map(function (tag) { return tag.name }).concat(mock.ingredients.map(function (ingredient) { return ingredient.name }))

  return mock
}

module.exports.create = create
