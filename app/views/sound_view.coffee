module.exports = class SoundView extends Backbone.View

  className: 'sound'

  template: require './templates/sound'

  events:
    'click': 'togglePlay'
    'dblclick': 'openOnSoundCloud'

  togglePlay: (e) =>
    play = @model.get('play')
    @model.set(play:!play)

  onChangePlaying: (model) =>
    if model.get('play') then @stream.play() else @stream.pause()

  onFinished: (model) =>
    #@waveform.update(@waveformData)
    #@render(model)

  openOnSoundCloud: (e) =>
    window.open @model.get('url')

  # TODO:
  # - refactor into separate methods
  # - move resolver into sound model
  render: (@model) =>
    @$el.html @template
    @$el.attr('title', 'Double click to open on SoundCloud')
    @model.on 'change:play', @onChangePlaying
    @model.on 'finished', @onFinished
    apiUrl = 'http://api.soundcloud.com/resolve.json'
    soundUrl = @model.get('url')
    req = $.getJSON "#{apiUrl}?url=#{soundUrl}&client_id=#{app.apiKey}"
    req.success (data) =>
      id = data.id
      SC.get "/tracks/#{id}", (track) =>
        # waveform.dataFromSoundCloudTrack(track) :(
        req = $.getJSON "http://waveformjs.org/w?url=#{data.waveform_url}&callback=?"
        req.success (data) =>
          @waveformData = data
          @waveform = new Waveform({
            container: @$el[0]
            innerColor: '#999'
            data: data
          })
          streamOptions = @waveform.optionsForSyncedStream()
          options =
            onfinish: (=> @model.trigger('finished', @model))
          _.extend( streamOptions, options )
          SC.stream track.uri, streamOptions, (stream) => @stream = stream
    this


