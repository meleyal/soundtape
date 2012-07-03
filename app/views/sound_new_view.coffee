module.exports = class SoundNewView extends Backbone.View

  className: 'sound-new tab'

  template: require './templates/sound_new'

  apiUrl: 'http://api.soundcloud.com/resolve.json'

  events:
    'submit form': 'create'

  render: =>
    @$el.html @template
    this

  show: ->
    @$el.show()

  hide: ->
    @$('form')[0].reset()
    @$el.hide()

  # TODO:
  # - refactor into new + create methods
  # - move resolver into model
  create: (e) =>
    e.preventDefault()
    playlist = app.playlists.current()
    soundUrl = @$('input[name="url"]').val()
    unless soundUrl is ""
      req = $.getJSON "#{@apiUrl}?url=#{soundUrl}&client_id=#{app.apiKey}"
      # TODO: move to create method
      req.success (res) =>
        data =
          url: soundUrl
          track_id: res.id
          playlist_id: playlist.id
        _.extend res, data
        sound = playlist.sounds.create(res)
        # TODO: refactor, views should bind to add event
        app.soundsView.addOne(sound)
        app.bannerView.deactivateNav()
        @hide()
