PlaylistView = require './playlist_view'

module.exports = class PlaylistsView extends Backbone.View

  className: 'playlists tab'
  template: require './templates/playlists'

  initialize: ->
    app.playlists.on 'reset', @addAll
    app.playlists.on 'add', @addOne
    app.playlists.on 'change:selected', @hide

  render: ->
    this

  show: ->
    @$el.show()

  hide: =>
    @$el.hide()

  addOne: (model) =>
    view = new PlaylistView
    @$el.append view.render(model).el

  addAll: (models) =>
    models.each @addOne
