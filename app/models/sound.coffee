# The **Sound** model is a container for the track data returned
# from the [SoundCloud /tracks API](http://developers.soundcloud.com/docs/api/reference#tracks).

module.exports = class Sound extends Backbone.Model

  # The only custom attribute is `play` which triggers
  # play/pause events in the `SoundView`.
  defaults:
    play: false
