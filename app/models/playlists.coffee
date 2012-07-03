module.exports = class Playlists extends Backbone.Collection

  model: require './playlist'

  localStorage: new Backbone.LocalStorage('Playlists')

  initialize: ->
    @on 'change:selected', @deactivateOthers
    @on 'change:selected', @setCookie

  current: ->
    @where(selected:true)[0]

  deactivateOthers: (active) ->
    others = @filter (playlist) -> playlist isnt active
    other.set(selected:false, { silent:true }) for other in others

  setCookie: (model) =>
    if model.get('selected')?
      _.cookie 'playlist', model.get('id')
