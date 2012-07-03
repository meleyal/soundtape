module.exports = class Sounds extends Backbone.Collection

  model: require './sound'

  localStorage: new Backbone.LocalStorage('Sounds')

  initialize: ->
    @on 'change:playing', @pauseOthers

  pauseOthers: (sound) =>
    if sound.get('playing')
      others = @filter (other) -> other isnt sound
      other.set(playing:false) for other in others

