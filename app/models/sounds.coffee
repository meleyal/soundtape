module.exports = class Sounds extends Backbone.Collection

  model: require './sound'

  localStorage: new Backbone.LocalStorage('Sounds')

  initialize: ->
    @on 'change:play', @pauseOthers

  pauseOthers: (sound) =>
    if sound.get('play')
      others = @filter (other) -> other isnt sound
      other.set(play:false) for other in others
