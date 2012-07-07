PlaylistView = require './playlist_view'

# The **PlaylistsView** (shown as a tab) renders a `PlaylistView`
# for each model in the `Playlists` colllection.

module.exports = class PlaylistsView extends Backbone.View

  # Set the CSS classes.
  className: 'playlists tab'

  # * Render all the playlists when the collection is reset/fetched.
  # * Render a single playlist when one is added.
  # * Hide the view when a playlist is selected.
  initialize: ->
    app.playlists.on 'reset', @addAll
    app.playlists.on 'add', @addOne
    app.playlists.on 'change:selected', @hide

  render: -> this

  # Helper to hide the view.
  hide: => @$el.hide()

  # Add a single `PlaylistView` to the list.
  addOne: (model) =>
    view = new PlaylistView
    @$el.append view.render(model).el

  # Add all models to the list.
  addAll: (models) =>
    models.each @addOne
