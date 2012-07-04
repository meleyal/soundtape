SoundView = require './sound_view'

module.exports = class SoundsView extends Backbone.View

  className: 'sounds'

  initialize: ->
    app.playlists.on 'change:selected', @renderSounds

  render: -> this

  renderSounds: (playlist) =>
    @$el.empty()
    @addAll playlist.sounds

  addOne: (model) =>
    view = new SoundView
    @$el.prepend view.render(model).el

  addAll: (models) =>
    models.each @addOne
