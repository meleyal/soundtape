module.exports = class SoundView extends Backbone.View

  className: 'sound'

  template: require './templates/sound'

  events:
    'click': 'togglePlay'

  togglePlay: (e) =>
    play = @model.get('play')
    @model.set(play:!play)

  onChangePlaying: (model) =>
    if model.get('play') then @stream.play() else @stream.pause()

  # TODO:
  # - refactor into separate methods
  # - move resolver into sound model
  render: (@model) =>
    @model.on 'change:play', @onChangePlaying
    @$el.html @template
    apiUrl = 'http://api.soundcloud.com/resolve.json'
    url = @model.get('url')
    foo = "#{apiUrl}?url=#{url}&client_id=76fc7439611dfed3405d099962c576d7"
    req = $.getJSON foo
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
          SC.stream track.uri, streamOptions, (stream) => @stream = stream
    this


