module.exports = class Sounds extends Backbone.Collection

  model: require './sound'

  localStorage: new Backbone.LocalStorage('Sounds')
