# The **Sounds** collection saves `Sound` models in localStorage
# via the [Backbone.localStorage adapter](https://github.com/jeromegn/Backbone.localStorage).

module.exports = class Sounds extends Backbone.Collection

  model: require './sound'

  localStorage: new Backbone.LocalStorage('Sounds')

  # `Sound` models respond to the `play` event.
  initialize: ->
    @on 'change:play', @pauseOthers

  # Pause all other sounds (`play:false`) when another is playing.
  pauseOthers: (sound) =>
    if sound.get('play')
      others = @filter (other) -> other isnt sound
      other.set(play:false) for other in others
