module.exports = class SoundNewView extends Backbone.View

  className: 'sound-new tab'

  template: require './templates/sound_new'

  apiUrls:
    resolve:  'http://api.soundcloud.com/resolve.json'
    waveform: 'http://waveformjs.org/w'

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
      req = $.getJSON "#{@apiUrls.resolve}?url=#{soundUrl}&client_id=#{app.apiKey}"
      req.success @create

  # TODO: refactor, views should bind to add event
  create: (res) =>
    playlist = app.playlists.current()
    $.when(@getWaveformData(res.waveform_url))
     .then (waveformData) =>
        extraData =
          track_id: res.id
          playlist_id: playlist.id
          waveform_data: waveformData
        sound = playlist.sounds.create(_.extend res, extraData)
        app.soundsView.addOne(sound)
        app.bannerView.deactivateNav()
        @hide()

  getWaveformData: (waveform_url) ->
    dfd = $.Deferred()
    req = $.getJSON "#{@apiUrls.waveform}?url=#{waveform_url}&callback=?"
    req.success (res) => dfd.resolve(res)
    dfd.promise()
