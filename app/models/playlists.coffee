# The **Playlists** collection saves `Playlist` models in localStorage
# via the [Backbone.localStorage adapter](https://github.com/jeromegn/Backbone.localStorage).

module.exports = class Playlists extends Backbone.Collection

  model: require './playlist'

  localStorage: new Backbone.LocalStorage('Playlists')

  # `Playlist` models respond to the `selected` event.
  initialize: ->
    @on 'change:selected', @deselectOthers
    @on 'change:selected', @setCookie

  # Helper to get the currently selected playlist.
  current: ->
    @where(selected:true)[0]

  # Deselect all other playlists when one is selected.
  deselectOthers: (active) ->
    others = @filter (playlist) -> playlist isnt active
    other.set(selected:false, { silent:true }) for other in others

  # Save the current playlist in a cookie.
  setCookie: (model) =>
    if model.get('selected')?
      _.cookie 'playlist', model.get('id')
