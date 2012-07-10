SoundView = require './sound_view'

# The **SoundsView** renders a `SoundView` for each model
# in the `Sounds` collection of a playlist.

module.exports = class SoundsView extends Backbone.View

  # Set the CSS class.
  className: 'sounds'

  # Render all the sounds for a playlist when it's selected.
  initialize: ->
    app.playlists.on 'change:selected', @renderSounds

  render: -> this

  # Render the sounds.
  renderSounds: (playlist) =>
    @$el.empty()
    @addAll playlist.sounds

  # Add a single sound to the list.
  addOne: (model) =>
    view = new SoundView
    @$el.prepend view.render(model).el

  # Add all sounds to the list.
  addAll: (models) =>
    models.each @addOne
