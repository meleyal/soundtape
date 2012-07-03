module.exports = class SoundNewView extends Backbone.View

  className: 'sound-new tab'

  template: require './templates/sound_new'

  apiUrl: 'http://api.soundcloud.com/resolve.json'

  events:
    'submit form': 'new'

  render: =>
    @$el.html @template
    this

  show: ->
    @$el.show()

  hide: ->
    @$('form')[0].reset()
    @$el.hide()

  new: (e) =>
    e.preventDefault()
    soundUrl = @$('input[name="url"]').val()
    unless soundUrl is ""
      req = $.getJSON "#{@apiUrl}?url=#{soundUrl}&client_id=#{app.apiKey}"
      req.success @create

  create: (res) =>
    playlist = app.playlists.current()
    _.extend res, { track_id: res.id, playlist_id: playlist.id }
    sound = playlist.sounds.create(res)
    # TODO: refactor, views should bind to add event
    app.soundsView.addOne(sound)
    app.bannerView.deactivateNav()
    @hide()
