# The **SoundNewView** (shown as a tab) renders a form for adding a new sound
# and handles the creation of new `Sound` models.
module.exports = class SoundNewView extends Backbone.View

  # Set the CSS classes.
  className: 'sound-new tab'

  # Cache the template.
  template: require './templates/sound_new'

  # Save the API URLs we'll need.
  apiUrls:
    resolve:  'http://api.soundcloud.com/resolve.json'
    waveform: 'http://waveformjs.org/w'

  # Handle the form submit event.
  events:
    'submit form': 'new'

  # Render the form into the DOM.
  render: =>
    @$el.html @template
    this

  # Helper to hide and reset the form.
  hide: ->
    @$('form')[0].reset()
    @$el.hide()

  # Try to resolve the submitted URL with the SC API
  # if it passes some basic validation.
  # JSONP is required for Safari.
  new: (e) =>
    e.preventDefault()
    url = @$('input[name="url"]').val()
    if url.match(/soundcloud.com/)?
      req = $.getJSON "#{@apiUrls.resolve}?url=#{url}&client_id=#{app.apiKey}&callback=?"
      req.success @create

  # If the URL is resolved and is a track, get the
  # waveform data for it and save the model.
  # `extraData` associates the sound with the current playlist
  # and saves references to the track id (required for streaming) and waveform data.
  # TODO: refactor, views should bind to add event.
  create: (res) =>
    return unless res.kind is 'track'
    playlist = app.playlists.current()
    $.when(@getWaveformData(res.waveform_url))
     .then (waveformData) =>
        extraData =
          track_id: res.id
          playlist_id: playlist.id
          waveform_data: waveformData
        sound = playlist.sounds.create(_.extend res, extraData)
        app.soundsView.addOne(sound)
        app.bannerView.deactivateTabs()
        @hide()

  # Get the waveform data from the Waveform.js API.
  # This is required as the `waveform.dataFromSoundCloudTrack()`
  # method is currently broken, see [goo.gl/hySSh](http://goo.gl/hySSh).
  getWaveformData: (waveform_url) ->
    dfd = $.Deferred()
    req = $.getJSON "#{@apiUrls.waveform}?url=#{waveform_url}&callback=?"
    req.success (res) => dfd.resolve(res)
    dfd.promise()
