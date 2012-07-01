module.exports = class Playlists extends Backbone.Collection

  model: require './playlist'

  localStorage: new Backbone.LocalStorage('Playlists')

  initialize: ->
    @on 'change:selected', @deactivateOthers

  current: ->
    @where(selected:true)[0]

  clearSelection: ->
    @each (model) -> model.set selected:false

  deactivateOthers: (active) ->
    others = @filter (playlist) -> playlist isnt active
    other.set(selected:false, { silent:true }) for other in others

