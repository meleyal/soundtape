module.exports = class SoundView extends Backbone.View

  className: 'sound'

  template: require './templates/sound'

  events:
    'click':    'togglePlay'
    'dblclick': 'openOnSoundCloud'

  togglePlay: (e) =>
    play = @model.get('play')
    @model.set(play:!play)

  onChangePlaying: (model) =>
    if model.get('play') then @stream.play() else @stream.pause()

  openOnSoundCloud: (e) =>
    window.open @model.get('permalink_url')

  # TODO:
  # - refactor into separate methods
  render: (@model) =>
    @$el.html @template
    @$el.attr('title', 'Double click to open on SoundCloud') # TODO: move to init?
    model.on 'change:play', @onChangePlaying
    model.on 'finished', @onFinished
    SC.get "/tracks/#{model.get('track_id')}", (track) =>
      # waveform.dataFromSoundCloudTrack(track) # :( not working http://goo.gl/hySSh
      waveOptions = { container: @$el[0], innerColor: '#999', data: model.get('waveform_data') }
      @waveform = new Waveform(waveOptions)
      streamOptions = @waveform.optionsForSyncedStream()
      options =
        onfinish: (=> @model.trigger('finished', @model))
      _.extend( streamOptions, options )
      SC.stream track.uri, streamOptions, (stream) => @stream = stream
    this
