# The **SoundView** renders a single `Sound` model using
# Waveform.js and streams it via the SC.stream API.

module.exports = class SoundView extends Backbone.View

  # Set the CSS class.
  className: 'sound'

  # Handle click and dblclick events.
  events:
    'click':    'togglePlay'
    'dblclick': 'showOnSoundCloud'

  # Show a tooltip when hovering a sound.
  initialize: ->
    @$el.attr 'title', 'Click to play, double click to open on SoundCloud'

  # Play state is saved in the model so it's
  # accessible to the `Sounds` collection.
  togglePlay: (e) =>
    play = @model.get 'play'
    @model.set play:!play

  # Play/pause a sound based on its `play` state
  onChangePlaying: (model) =>
    if model.get('play') then @stream.play() else @stream.pause()

  # Open the track on SoundCloud in a new window.
  showOnSoundCloud: (e) =>
    window.open @model.get('permalink_url')

  # Actual rendering is handled by `renderTrack`.
  # Bind to the `change:play` event to toggle the play/pause state.
  render: (@model) =>
    model.on 'change:play', @onChangePlaying
    @renderTrack(model)
    this

  # Get the track from the SC API, render the waveform and start the stream.
  renderTrack: (model) ->
    SC.get "/tracks/#{model.get('track_id')}", (track) =>
      waveform = @renderWaveform(model.get('waveform_data'))
      @streamTrack(track, waveform)

  # Render the waveform using the saved waveformData from the model.
  renderWaveform: (waveformData) ->
    # waveform.dataFromSoundCloudTrack(track) # :( not working http://goo.gl/hySSh
    options = { container: @$el[0], innerColor: '#999', data: waveformData }
    new Waveform(options)

  # Stream the track and bind to the finished event.
  streamTrack: (track, waveform) =>
    streamOptions = waveform.optionsForSyncedStream()
    options = { onfinish: (=> @model.trigger('finished', @model)) }
    _.extend( streamOptions, options )
    SC.stream track.uri, streamOptions, (stream) => @stream = stream

