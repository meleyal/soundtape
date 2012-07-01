Sounds = require '../models/sounds'

module.exports = class Playlist extends Backbone.Model

  defaults:
    title: 'SoundTape'
    description: ''
    #color: '#F60'
    selected: false

  initialize: ->
    app.sounds.fetch()
    sounds = app.sounds.where(playlist_id: @id)
    @sounds = new Sounds(sounds)
    @set 'color', @randomColor() unless @get('color')?
    #@on 'change:selected', @sounds.fetch()
    super

  # src: http://goo.gl/yKUXW
  randomColor: ->
    '#' + Math.floor(Math.random() * 16777215).toString(16)

