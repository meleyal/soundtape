PlaylistView = require './playlist_view'

module.exports = class PlaylistsView extends Backbone.View

  className: 'playlists tab'

  initialize: ->
    app.playlists.on 'reset', @addAll
    app.playlists.on 'add', @addOne
    app.playlists.on 'change:selected', @hide

  render: -> this

  hide: => @$el.hide()

  addOne: (model) =>
    view = new PlaylistView
    @$el.append view.render(model).el

  addAll: (models) =>
    models.each @addOne
