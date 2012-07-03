module.exports = class SoundView extends Backbone.View

  className: 'sound'

  events:
    'click':    'togglePlay'
    'dblclick': 'openOnSoundCloud'

  initialize: ->
    @$el.attr 'title', 'Click to play, double click to open on SoundCloud'

  togglePlay: (e) =>
    play = @model.get('play')
    @model.set(play:!play)

  onChangePlaying: (model) =>
    if model.get('play') then @stream.play() else @stream.pause()

  openOnSoundCloud: (e) =>
    window.open @model.get('permalink_url')

  render: (@model) =>
    model.on 'change:play', @onChangePlaying
    model.on 'finished', @onFinished
    @renderTrack(model)
    this

  renderTrack: (model) ->
    SC.get "/tracks/#{model.get('track_id')}", (track) =>
      waveform = @renderWaveform(model.get('waveform_data'))
      @streamTrack(track, waveform)

  renderWaveform: (waveformData) ->
    # waveform.dataFromSoundCloudTrack(track) # :( not working http://goo.gl/hySSh
    options = { container: @$el[0], innerColor: '#999', data: waveformData }
    new Waveform(options)

  streamTrack: (track, waveform) =>
    streamOptions = waveform.optionsForSyncedStream()
    options = { onfinish: (=> @model.trigger('finished', @model)) }
    _.extend( streamOptions, options )
    SC.stream track.uri, streamOptions, (stream) => @stream = stream

