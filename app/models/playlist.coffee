Sounds = require '../models/sounds'

# The **Playlist** model has `title`, `description`, `color`
# and `selected` attributes. It also holds a `sounds` collection,
# associated by the `playlist_id` foreign key on each `Sound`.

module.exports = class Playlist extends Backbone.Model

  # Set some useful defaults.
  defaults:
    title: 'SoundTape'
    description: ''
    selected: false

  # Populate the playlist from the `Sounds` store.
  # Set a random color unless one is already set.
  initialize: ->
    app.sounds.fetch()
    sounds = app.sounds.where playlist_id:@id
    @sounds = new Sounds sounds
    @sounds.on 'finished', @playNext
    @set 'color', @randomColor() unless @get('color')?

  # Generate a random color for the playlist,
  # based on [goo.gl/yKUXW](http://goo.gl/yKUXW).
  randomColor: ->
    '#' + Math.floor(Math.random() * 16777215).toString(16)

  # Find the next sound in the playlist and play it
  # (triggered by the `finished` event on the `Sound` model).
  playNext: (sound) =>
    index = @sounds.indexOf sound
    next = @sounds.at(index - 1)
    next.set(play:true) if next

